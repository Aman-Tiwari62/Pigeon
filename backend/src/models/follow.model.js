import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

followSchema.index(
    { follower: 1, following: 1 },
    { unique: true }
);

followSchema.pre("save", async function () {
  if (this.follower.equals(this.following)) {
    throw new Error("User cannot follow themselves");
  }
});



const Follow = mongoose.model("Follow", followSchema);
export default Follow;

  
