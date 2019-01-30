Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        },
    },
    template: '<div class="product">\n' +
        '        <div class="product-image">\n' +
        '            <img v-bind:src="image">\n' +
        '        </div>\n' +
        '        <div class="product-info">\n' +
        '            <h1 :class="{red: product.onSale}">{{ title }}</h1>\n' +
        '\n' +
        '            <span v-show="product.onSale" class="bright-red">On sale!!!</span>\n' +
        '\n' +
        '            <p v-if="productCount >= 5" class="tip green">In stock</p>\n' +
        '            <p v-else-if="productCount < 5 && productCount > 0" class="tip yellow">Almost sold out</p>\n' +
        '            <p v-else class="tip red">Out of stock</p>\n' +
        '            <p>Shipping: {{ shipping }}</p>' +
        '\n' +
        '            <ul class="product-details">\n' +
        '                <li v-for="detail in product.details">{{ detail }}</li>\n' +
        '            </ul>\n' +
        '\n' +
        '            <div @mouseover="updateProduct(variantIndex)"\n' +
        '                 v-for="(variant, variantIndex) in product.variants"\n' +
        '                 class="inline"\n' +
        '                 :style="{ backgroundColor:variant.color }">\n' +
        '                <span class="font-weight-bold">{{ variant.color }}</span>\n' +
        '            </div>\n' +
        '\n' +
        '            <br><br>\n' +
        '\n' +
        '            <button @click="addToCart" class="btn btn-primary"  :disabled="!productCount>0">Add to Cart</button>\n' +
        '\n' +
        '            <div class="cart">\n' +
        '                <p>Cart({{ cart }})</p>\n' +
        '            </div>\n' +
        '\n' +
        '            <button @click="emptyCart()" class="btn btn-dark">Empty Cart</button>\n' +
        '        </div>\n' +
        '    </div>',
    data() {
        return {
            product: {
                selectedVariant: 0,
                brand: "Some brand",
                name: "Some product",
                image: "images/product-default.png",
                onSale: false,
                details: ["Feature one", "Awesome ability", "Legendary reliability"],
                variants: [
                    {
                        id: 63455,
                        color: "green",
                        image: "images/product-green.png",
                        count: 10,
                    },
                    {
                        id: 63456,
                        color: "red",
                        image: "images/product-red.png",
                        count: 0,
                    },
                ],
            },
            cart: 0,
        };
    },
    methods: {
        addToCart: function () {
            this.cart++;
        },
        updateProduct: function (variantIndex) {
            this.product.selectedVariant = variantIndex;
            this.product.image = this.product.variants[variantIndex].image;
        },
        emptyCart: function () {
            this.cart = 0;
        }
    },
    computed: {
        title() {
            return this.product.brand + " " + this.product.name;
        },
        image() {
            return this.product.variants[this.product.selectedVariant].image;
        },
        productCount() {
            return this.product.variants[this.product.selectedVariant].count;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            }
            return 300.00;
        },
    },
});

var app = new Vue({
    el: "#app",
    data: {
        premium: true,
    },
});