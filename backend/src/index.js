import { app } from "./app.js";
import connectDB from "./db/index.js"


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8080, () => {
        console.log(`server is running at port ${process.env.PORT || 8080}`)
    })
})
.catch((err) => {
    console.log("Mongo DB connection failed !!!", err)
})