class Carousel extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open' });
        // Binding functions
        this._addLightDOMChildrenToNode = this._addLightDOMChildrenToNode.bind(this);
        this._removeChildrenFromLightDOM = this._removeChildrenFromLightDOM.bind(this);
        this._scroll = this._scroll.bind(this);
        this._scrollRight = this._scrollRight.bind(this);
        this._scrollLeft = this._scrollLeft.bind(this);

        this._itemsDisplayed = this.getAttribute('items-displayed') ?? 2;
        
        this.shadowRoot.innerHTML = `
            <section id="carousel-container">
                <button id="btn-left" class="btn">➜</button>
                <button id="btn-right" class="btn">➜</button>
                <section id="carousel"></section>
            </section>
        `;

        this._gap = 10;
        this._padding = 10;

        this._addLightDOMChildrenToNode('carousel');
        this._removeChildrenFromLightDOM();
    }
    connectedCallback(){
        this.shadowRoot.innerHTML = `
            ${this.shadowRoot.innerHTML}
            <style>
                ${this._getCSS()}
            </style>
        `;

        this._carousel = this.shadowRoot.getElementById('carousel');
        
        this._addEventListeners();
    }
    disconnectedCallback(){
        this._removeEventListeners();
    }
    _addLightDOMChildrenToNode(id){
        const node = this.shadowRoot.getElementById(id);
        for(let child of this.children){
            node.appendChild(child.cloneNode(true));
        }
    }
    _removeChildrenFromLightDOM(){
        const length = this.children.length;
        for(let i = 0; i < length; i++){
            this.firstElementChild.remove();
        }
    }
    _setFixedCarouselWidth(){
        this._carousel.style.width = `${this._getCarouselWidth()}px`;
    }
    _setFixedCarouselContainerWidth(){
        this.shadowRoot.getElementById('carousel-container').style.width = `${this._getCarouselContainerWidth}px`;
    }
    _addEventListeners(){
        this.shadowRoot.getElementById('btn-left').addEventListener('click', this._scrollLeft);
        this.shadowRoot.getElementById('btn-right').addEventListener('click', this._scrollRight);
    }
    _removeEventListeners(){
        this.shadowRoot.getElementById('btn-left').removeEventListener('click', this._scrollLeft);
        this.shadowRoot.getElementById('btn-right').removeEventListener('click', this._scrollRight);
    }
    _scroll(left){
        this._carousel.scroll({
            top: 0,
            left: left,
            behavior: 'smooth'
        });
    }
    _scrollRight(){
        const new_position = this._carousel.scrollLeft + (this._carousel.offsetWidth+this._gap-this._padding);
        this._scroll(Math.min(new_position, this._carousel.scrollWidth));
    }
    _scrollLeft(){
        const new_position = this._carousel.scrollLeft - (this._carousel.offsetWidth+this._gap-this._padding);
        this._scroll(Math.max(0, new_position));
    }
    _getCSS(){
        return `
            #carousel-container {
                position: relative;
                // width: auto;
            }
            .btn {
                position: absolute;
                top: 45%;
            }
            #btn-left {
                transform: rotateY(180deg);
                left: 0;
            }
            #btn-right { right: 0; }
            #carousel {
                display: flex;
                flex-direction: row;
                overflow-x: scroll;
                justify-content: start;
                gap: ${this._gap}px;
                align-items: center;
                padding: 0 ${this._padding}px;
                scroll-behavior: smooth;
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
            }
            #carousel::-webkit-scrollbar { display: none; }
            .card {
                min-width: 33%;
                border: 1px solid #999;
                box-sizing: border-box;
            }
        `;
    }
}
window.customElements.define('my-carousel', Carousel);