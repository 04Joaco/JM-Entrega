const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
});

cartSchema.methods.addToCart = async function (productId, quantity) {
  try {
    const existingItem = this.items.find(item => item.productId.equals(productId));

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ productId, quantity });
    }

    await this.save();
    return this;
  } catch (error) {
    throw new Error(`Error en addToCart: ${error.message}`);
  }
};

cartSchema.methods.populateProducts = async function () {
  await this.populate('items.productId').execPopulate();
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

