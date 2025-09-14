import { Sequelize } from 'sequelize';

import { Address, initAddressModel } from './address.model';
import { Attribute, initAttributeModel } from './attribute.model';
import { AttributeValue, initAttributeValueModel } from './attribute-value.model';
import { Brand, initBrandModel } from './brand.model';
import { Cart, initCartModel } from './cart.model';
import { CartItem, initCartItemModel } from './cart-item.model';
import { Category, initCategoryModel } from './category.model';
import { initInventoryMovementModel, InventoryMovement } from './inventory-movement.model';
import { initOrderModel, Order } from './order.model';
import { initOrderAddressModel, OrderAddress } from './order-address.model';
import { initOrderItemModel, OrderItem } from './order-item.model';
import { initPaymentModel, Payment } from './payment.model';
import { initProductModel, Product } from './product.model';
import { initProductImageModel, ProductImage } from './product-image.model';
import { initProductOptionModel, ProductOption } from './product-option.model';
import { initProductReviewModel, ProductReview } from './product-review.model';
import { initProductVariantModel, ProductVariant } from './product-variant.model';
import { initProductVariantValueModel, ProductVariantValue } from './product-variant-value.model';
import { initRefundModel, Refund } from './refund.model';
import { initSellerReviewModel, SellerReview } from './seller-review.model';
import { initShipmentModel, Shipment } from './shipment.model';
import { initShipmentItemModel, ShipmentItem } from './shipment-item.model';
import { initStoreModel, Store } from './store.model';
import { initUserModel, User } from './user.model';
import { initWishlistModel, Wishlist } from './wishlist.model';

export function initModels(sequelize: Sequelize) {
  initUserModel(sequelize);
  initStoreModel(sequelize);
  initAddressModel(sequelize);
  initCategoryModel(sequelize);
  initBrandModel(sequelize);
  initAttributeModel(sequelize);
  initAttributeValueModel(sequelize);
  initProductModel(sequelize);
  initProductImageModel(sequelize);
  initProductOptionModel(sequelize);
  initProductVariantModel(sequelize);
  initProductVariantValueModel(sequelize);
  initCartModel(sequelize);
  initCartItemModel(sequelize);
  initOrderModel(sequelize);
  initOrderItemModel(sequelize);
  initOrderAddressModel(sequelize);
  initPaymentModel(sequelize);
  initShipmentModel(sequelize);
  initShipmentItemModel(sequelize);
  initRefundModel(sequelize);
  initProductReviewModel(sequelize);
  initSellerReviewModel(sequelize);
  initWishlistModel(sequelize);
  initInventoryMovementModel(sequelize);

  // 2) Asociaciones
  ProductOption.belongsTo(Attribute, { foreignKey: 'attributeId', as: 'attribute' });

  // Variant values
  ProductVariant.hasMany(ProductVariantValue, { foreignKey: 'variantId', as: 'variantValues' });
  ProductVariantValue.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });
  ProductVariantValue.belongsTo(Attribute, { foreignKey: 'attributeId', as: 'attribute' });
  ProductVariantValue.belongsTo(AttributeValue, {
    foreignKey: 'attributeValueId',
    as: 'attributeValue',
  });

  // Carts
  Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(Cart, { foreignKey: 'userId', as: 'carts' });

  Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
  CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
  CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
  Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });
  CartItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });
  ProductVariant.hasMany(CartItem, { foreignKey: 'variantId', as: 'cartItems' });

  // Orders
  Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
  OrderItem.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });
  OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
  OrderItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });

  Order.hasMany(OrderAddress, { foreignKey: 'orderId', as: 'addresses' });
  OrderAddress.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

  // Payments & Refunds
  Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
  Order.hasMany(Payment, { foreignKey: 'orderId', as: 'payments' });

  Refund.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });
  Payment.hasMany(Refund, { foreignKey: 'paymentId', as: 'refunds' });

  // Shipments
  Shipment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
  Order.hasMany(Shipment, { foreignKey: 'orderId', as: 'shipments' });

  Shipment.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

  Shipment.hasMany(ShipmentItem, { foreignKey: 'shipmentId', as: 'items' });
  ShipmentItem.belongsTo(Shipment, { foreignKey: 'shipmentId', as: 'shipment' });
  ShipmentItem.belongsTo(OrderItem, { foreignKey: 'orderItemId', as: 'orderItem' });

  // Reviews
  ProductReview.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
  Product.hasMany(ProductReview, { foreignKey: 'productId', as: 'productReviews' });
  ProductReview.belongsTo(User, { foreignKey: 'authorUserId', as: 'author' });
  User.hasMany(ProductReview, { foreignKey: 'authorUserId', as: 'productReviews' });

  SellerReview.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });
  Store.hasMany(SellerReview, { foreignKey: 'storeId', as: 'sellerReviews' });
  SellerReview.belongsTo(User, { foreignKey: 'authorUserId', as: 'author' });
  User.hasMany(SellerReview, { foreignKey: 'authorUserId', as: 'sellerReviews' });

  // Wishlist (muchos a muchos vía tabla propia)
  User.belongsToMany(Product, {
    through: Wishlist,
    foreignKey: 'userId',
    otherKey: 'productId',
    as: 'wishlistProducts',
  });
  Product.belongsToMany(User, {
    through: Wishlist,
    foreignKey: 'productId',
    otherKey: 'userId',
    as: 'wishlistedBy',
  });
  Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
  User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlists' });
  Product.hasMany(Wishlist, { foreignKey: 'productId', as: 'wishlists' });

  // Inventory movements
  InventoryMovement.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });
  ProductVariant.hasMany(InventoryMovement, { foreignKey: 'variantId', as: 'inventoryMovements' });

  return {
    User,
    Store,
    Address,
    Category,
    Brand,
    Attribute,
    AttributeValue,
    Product,
    ProductImage,
    ProductOption,
    ProductVariant,
    ProductVariantValue,
    Cart,
    CartItem,
    Order,
    OrderItem,
    OrderAddress,
    Payment,
    Shipment,
    ShipmentItem,
    Refund,
    ProductReview,
    SellerReview,
    Wishlist,
    InventoryMovement,
  };
}
