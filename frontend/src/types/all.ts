export interface ErrorApiRes {
    message: string
}



export interface Subscription {
    _id: string;
    name: string;
    description: string;
    price: number;
    discount: number;
    startDate: string;
    endDate: string;
  }
  
export interface SubscriptionState {
    subscriptions: Subscription[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  }
  
 