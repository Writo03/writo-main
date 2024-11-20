import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../redux/auth'
import subscriptionReducer from '../redux/service'
export const store = configureStore({
    reducer : {
        auth:userReducer,
        subscriptions: subscriptionReducer,

    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch