import {Request} from 'app/season/dao';


/** Returns the cost of a request (quantity * item cost). */
export function getRequestCost(itemCost: number, request: Request) {
  let quantityToPurchase = request.quantity;

  if (request.allocation) {
    quantityToPurchase -= request.allocation;
    quantityToPurchase = Math.max(quantityToPurchase, 0);
  }

  let requestCost = itemCost ? quantityToPurchase * itemCost : 0;

  // Add wear-and-tear cost of item
  if (request.allocation) {
    requestCost += (itemCost / 5) * request.allocation;
  }

  // Adjust with manual cost adjustment
  if (request.costAdjustment) {
    requestCost += request.costAdjustment;
  }

  // Add sales tax of 9.5%
  requestCost = requestCost * 1.095;

  return requestCost;
}
