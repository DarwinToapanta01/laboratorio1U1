class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        const template = document.getElementById("product-card-template");
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // agrego estilos al shadow DOM
        const style = document.createElement("style");
        style.textContent = this.getStyles();
        this.shadowRoot.appendChild(style);
    }

    static get observedAttributes() {
        return ["img", "title", "price", "description", "collection"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.shadowRoot) return;

        switch (name) {
            case "img":
                const imgElem = this.shadowRoot.querySelector("img");
                if (imgElem) {
                    imgElem.src = newValue;
                    imgElem.alt = this.getAttribute("title") || "Imagen del producto";
                }
                break;

            case "title":
                this._updateSlotContent("title", newValue);
                const img = this.shadowRoot.querySelector("img");
                if (img) img.alt = newValue;
                break;

            case "price":
                this._updateSlotContent("price", newValue);
                break;

            case "description":
                this._updateSlotContent("description", newValue);
                break;

            case "collection":
                this._updateSlotContent("collection", newValue);
                break;
        }
    }

    _updateSlotContent(name, value) {
        let slotTextNode = this.querySelector(`span[slot=${name}]`);
        if (!slotTextNode) {
            slotTextNode = document.createElement("span");
            slotTextNode.setAttribute("slot", name);
            this.appendChild(slotTextNode);
        }
        slotTextNode.textContent = value;
    }

    connectedCallback() {
        const button = this.shadowRoot.querySelector("button");
        if (button) {
            button.addEventListener("click", () => {
                this.dispatchEvent(
                    new CustomEvent("add-to-cart", {
                        bubbles: true,
                        composed: true,
                        detail: {
                            title: this.getAttribute("title"),
                            price: this.getAttribute("price"),
                        },
                    })
                );
            });
        }
    }

    getStyles() {
        return `
          :host {
            display: block;
            width: 300px;
            height: 450px;
            box-sizing: border-box;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            background: white;
            font-family: Arial, sans-serif;
          }
          img {
            width: 100%;
            height: 200px;
            object-fit: contain;
            background: #f0f0f0;
          }
          .container {
            padding: 16px;
            display: flex;
            flex-direction: column;
            height: calc(100% - 200px);
            justify-content: space-between;
          }
          .title {
            font-weight: bold;
            font-size: 1.2rem;
            margin-bottom: 8px;
          }
          .price {
            color: green;
            font-weight: bold;
            margin-bottom: 12px;
          }
          button {
            background: #007bff;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          button:hover {
            background: #0056b3;
          }
        `;
    }
}

customElements.define("product-card", ProductCard);

const cartCountElem = document.getElementById("cart-count");
let cartCount = 0;

document.body.addEventListener("add-to-cart", (event) => {
    cartCount++;
    cartCountElem.textContent = cartCount;
    // console.log("Producto agregado al carrito:", event.detail);
});
