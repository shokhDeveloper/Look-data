import { foods } from "../../database/foods.js";
import { orders } from "../../database/orders.js";
import { users } from "../../database/users.js";

export default {
  Query: {
    orders: (_, { userId, orderId }) => {
      if (userId) {
        return [orders.find((order) => order.user_id == userId)];
      }
      if (orderId) {
        return [orders.find((order) => order.order_id == orderId)];
      }
      return orders;
    },
  },
  Mutation: {
    updateOrder: (_, args) => {
      try {
        if (args.orderId) {
          const idx = orders.findIndex(
            (order) => order.order_id == args.orderId
          );
          let foodIdx;
          let userIdx;
          let updateData;
          if (args.foodId) {
            foodIdx = foods.findIndex((food) => food.food_id == args.foodId);
          }
          if (args.userId) {
            userIdx = userIdx = users.findIndex(
              (user) => user.user_id == args.userId
            );
          }
          if (idx >= 0) {
            if (!(args.foodId && foodIdx >= 0))
              throw new Error("Food not found. Food id is invalid");
            if (!(args.userId && userIdx >= 0))
              throw new Error("User not found. User id is invalid");
            updateData = { order_id: args.orderId };
            if (foodIdx == 0 || userIdx) {
              updateData = { ...updateData, food: foods[foodIdx] };
            }
            if (userIdx == 0 || userIdx) {
              updateData = { ...updateData, user: users[idx] };
            }

            if (args.count) {
              updateData = { ...updateData, count: args.count };
            }
            orders[idx] = updateData;

            return {
              status: 200,
              message: "Order successfully updated.",
              data: updateData,
            };
          } else throw new Error("Order not found");
        }
      } catch (error) {
        return {
          status: error.status || 500,
          message: error.message,
        };
      }
    },
    deleteOrder: (_, {orderId}) => {
        try{    
            if(orderId){
                const idx = orders.findIndex((order) => order.order_id == orderId);
                if(idx >= 0) {
                   orders.splice(idx, 1)
                    return {
                        status: 200,
                        message: "Order successfully deleted !",
                        data: {}
                    }
                }else throw new Error("Order not found")
            }
        }catch(error){
            return {
                status: error.status || 500,
                message: error.message
            }
        }
    },
    addOrder: ( _, newOrder) => {
        try{
            if(!foods.some((food) => food.food_id == newOrder.foodId)) throw new Error("Food not found");
            if(!users.some((user) => user.user_id == newOrder.userId)) throw new Error("User not found");
            newOrder = {
                user: users.find((user) => user.user_id == newOrder.userId),
                food: foods.find((food) => food.food_id == newOrder.foodId),
                order_id: orders.length + 1,
                count: newOrder.count
            }
            orders.push(newOrder)
            return {
                status: 201,
                message: "The order successfully created !",
                data: newOrder
            }
        }catch(error){
            return {
                status: error.status || 500,
                message: error.message
            }
        }
    }
  },
  Order: {
    orderId: (parent) => parent.order_id,
    user: (parent) => users.find((user) => user.user_id == parent.user_id),
    food: (parent) => foods.find((food) => food.food_id == parent.food_id),
    count: (parent) => parent.count,
  },
};
