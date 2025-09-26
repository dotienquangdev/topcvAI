const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");

const depositPriceSchema = new mongoose.Schema({
  amountMoney: {
    type: Number,
    required: true,
  },
  coins: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  status: {
    // Trạng thái
    type: String,
    default: "active",
  },
  //Ngày cập nhật
  update_at: {
    type: Date,
    default: Date.now,
  },
});
depositPriceSchema.plugin(mongoosePaginate);
const DepositPrice = mongoose.model(
  "deposit_price",
  depositPriceSchema,
  "deposit_price"
);
module.exports = DepositPrice;
