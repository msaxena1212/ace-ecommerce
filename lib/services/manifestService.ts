/**
 * Manifest Service
 * Handles creation and management of delivery manifests
 */

import { prisma } from '@/lib/prisma'
import { DeliveryPartner } from '@prisma/client'
import { generateManifestNumber } from '@/lib/utils'
import { calculateDeliveryPartner } from '@/lib/utils/deliveryLogic'

interface ManifestData {
    orderId: string
    dealerId: string
    items: any[]
    pickupAddress: any
    deliveryAddress: any
    distance: number
}

/**
 * Create a single manifest for an order
 */
export async function createManifest(data: ManifestData) {
    const { orderId, dealerId, items, pickupAddress, deliveryAddress, distance } = data

    // Determine delivery partner based on time and distance
    const deliveryOption = calculateDeliveryPartner(new Date(), distance)

    // Create manifest
    const manifest = await prisma.manifest.create({
        data: {
            manifestNumber: generateManifestNumber(),
            orderId,
            dealerId,
            pickupAddress,
            deliveryAddress,
            items,
            deliveryPartner: deliveryOption.partner,
            status: 'CREATED',
        },
    })

    // Call delivery partner API to create shipment
    if (deliveryOption.partner === 'PORTER') {
        await createPorterShipment(manifest)
    } else {
        await createDelhiveryShipment(manifest)
    }

    return manifest
}

/**
 * Create multiple manifests for multi-source orders
 */
export async function createMultiSourceManifests(
    orderId: string,
    sources: Array<{
        dealerId: string
        items: any[]
        pickupAddress: any
    }>,
    deliveryAddress: any,
    distance: number
) {
    const manifests = []

    for (const source of sources) {
        const manifest = await createManifest({
            orderId,
            dealerId: source.dealerId,
            items: source.items,
            pickupAddress: source.pickupAddress,
            deliveryAddress,
            distance,
        })

        manifests.push(manifest)
    }

    return manifests
}

/**
 * Create Porter shipment via API
 */
async function createPorterShipment(manifest: any) {
    try {
        // TODO: Integrate with actual Porter API
        // const response = await fetch(`${process.env.PORTER_API_URL}/orders/create`, {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${process.env.PORTER_API_KEY}`,
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     pickup_details: {
        //       address: manifest.pickupAddress,
        //     },
        //     drop_details: {
        //       address: manifest.deliveryAddress,
        //     },
        //     order_details: {
        //       order_id: manifest.manifestNumber,
        //       items: manifest.items,
        //     },
        //   }),
        // })

        // const data = await response.json()

        // Update manifest with tracking ID
        await prisma.manifest.update({
            where: { id: manifest.id },
            data: {
                trackingId: `PORTER-${manifest.manifestNumber}`, // Mock tracking ID
                status: 'PICKUP_SCHEDULED',
                scheduledPickup: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
                estimatedDelivery: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
            },
        })

        console.log('Porter shipment created:', manifest.manifestNumber)
    } catch (error) {
        console.error('Error creating Porter shipment:', error)
        throw error
    }
}

/**
 * Create Delhivery shipment via API
 */
async function createDelhiveryShipment(manifest: any) {
    try {
        // TODO: Integrate with actual Delhivery API
        // const response = await fetch(`${process.env.DELHIVERY_API_URL}/cmu/create.json`, {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Token ${process.env.DELHIVERY_API_KEY}`,
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     shipments: [{
        //       name: manifest.deliveryAddress.name,
        //       add: manifest.deliveryAddress.addressLine1,
        //       pin: manifest.deliveryAddress.pincode,
        //       city: manifest.deliveryAddress.city,
        //       state: manifest.deliveryAddress.state,
        //       phone: manifest.deliveryAddress.phone,
        //       order: manifest.manifestNumber,
        //       payment_mode: 'Prepaid',
        //       return_add: manifest.pickupAddress.addressLine1,
        //       return_pin: manifest.pickupAddress.pincode,
        //       return_city: manifest.pickupAddress.city,
        //       return_state: manifest.pickupAddress.state,
        //       return_phone: manifest.pickupAddress.phone,
        //     }],
        //   }),
        // })

        // const data = await response.json()

        // Update manifest with tracking ID
        await prisma.manifest.update({
            where: { id: manifest.id },
            data: {
                trackingId: `DELHIVERY-${manifest.manifestNumber}`, // Mock tracking ID
                status: 'PICKUP_SCHEDULED',
                scheduledPickup: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
                estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
            },
        })

        console.log('Delhivery shipment created:', manifest.manifestNumber)
    } catch (error) {
        console.error('Error creating Delhivery shipment:', error)
        throw error
    }
}

/**
 * Update manifest status (called by delivery partner webhooks)
 */
export async function updateManifestStatus(
    manifestId: string,
    status: string,
    trackingData?: any
) {
    const statusMap: Record<string, any> = {
        'pickup_scheduled': { status: 'PICKUP_SCHEDULED' },
        'picked_up': { status: 'PICKED_UP', actualPickup: new Date() },
        'in_transit': { status: 'IN_TRANSIT' },
        'out_for_delivery': { status: 'OUT_FOR_DELIVERY' },
        'delivered': { status: 'DELIVERED', actualDelivery: new Date() },
        'failed': { status: 'FAILED' },
    }

    const updateData = statusMap[status] || { status: 'CREATED' }

    await prisma.manifest.update({
        where: { id: manifestId },
        data: updateData,
    })

    // Also update order status
    const manifest = await prisma.manifest.findUnique({
        where: { id: manifestId },
        include: { order: true },
    })

    if (manifest) {
        let orderStatus = manifest.order.status

        switch (status) {
            case 'picked_up':
                orderStatus = 'PICKED_UP'
                break
            case 'in_transit':
                orderStatus = 'IN_TRANSIT'
                break
            case 'out_for_delivery':
                orderStatus = 'OUT_FOR_DELIVERY'
                break
            case 'delivered':
                orderStatus = 'DELIVERED'
                break
        }

        await prisma.order.update({
            where: { id: manifest.orderId },
            data: { status: orderStatus },
        })
    }
}
