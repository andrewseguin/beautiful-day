import {Request} from 'app/season/dao';


/** Returns the cost of a request (quantity * item cost). */
export function getRequestCost(itemCost: number, request: Request) {
  let quantityToPurchase = request.quantity;

  if (request.allocation) {
    quantityToPurchase -= request.allocation;
    quantityToPurchase = Math.max(quantityToPurchase, 0);
  }

  return itemCost ? quantityToPurchase * itemCost : 0;
}
