import app from "./index.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectUsingMongoose();
});