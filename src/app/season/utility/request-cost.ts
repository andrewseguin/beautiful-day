import { Request } from 'app/season/dao';


/** Returns the cost of a request (quantity * item cost). */
export function getRequestCost(itemCost: number, request: Request) {
  let quantityToPurchase = request.quantity;

  if (request.allocation) {
    quantityToPurchase -= request.allocation;
    quantityToPurchase = Math.max(quantityToPurchase, 0);
  }

  let requestCost = itemCost ? quantityToPurchase * itemCost : 0;

  // Add sales tax of 9.5%
  requestCost = requestCost * 1.095;

  // Adjust with manual cost adjustment
  if (request.costAdjustment) {
    requestCost += request.costAdjustment;
  }

  return requestCost;
}
