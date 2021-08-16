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

        this._numberOfCardsInCarousel = this._numberOfCardsInCarousel.bind(this);
        this._newPosition = this._newPosition.bind(this);
        
        this.shadowRoot.innerHTML = `
            <section id="carousel-container">
                <button id="btn-left" class="btn">➜</button>
                <button id="btn-right" class="btn">➜</button>
                <section id="carousel"></section>
            </section>
        `;

        this._gap = 20;

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
    _addEventListeners(){
        this.shadowRoot.getElementById('btn-left').addEventListener('click', this._scrollLeft);
        this.shadowRoot.getElementById('btn-right').addEventListener('click', this._scrollRight);
    }
    _removeEventListeners(){
        this.shadowRoot.getElementById('btn-left').removeEventListener('click', this._scrollLeft);
        this.shadowRoot.getElementById('btn-right').removeEventListener('click', this._scrollRight);
    }
    _getCardWidth(){
        const count = (1/this._itemsDisplayed)*100;
        return `${count}% - ${this._gap*0.454545}px`;
    }
    _scroll(left){
        this._carousel.scroll({
            top: 0,
            left: left,
            behavior: 'smooth'
        });
    }
    _newPosition(direction){
        const amount = this._carousel.offsetWidth;
        if(direction === "left"){
            return this._carousel.scrollLeft - amount;
        }else{
            return this._carousel.scrollLeft + amount;
        }
    }
    _scrollRight(){
        const new_position = this._newPosition("right");
        this._scroll(Math.min(new_position, this._carousel.scrollWidth));
    }
    _scrollLeft(){
        const new_position = this._newPosition("left");
        this._scroll(Math.max(0, new_position));
    }
    _numberOfCardsInCarousel(){
        return this.shadowRoot.getElementById('carousel').childElementCount;
    }
    _getCSS(){
        return `
            #carousel-container {
                position: relative;
                padding: 0 20px;
                box-sizing: border-box;
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
                gap: ${this._gap}px;
                padding: 20px ${this._gap}px;
                box-sizing: border-box;
                align-items: stretch;
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
                width: 97.5%;
                margin: auto;
            }
            #carousel::-webkit-scrollbar { display: none; }
            .card {
                min-width: calc(${this._getCardWidth()});
            }
            ${!!this.getAttribute('card-css') && this.getAttribute('card-css')}
        `;
    }
}
window.customElements.define('my-carousel', Carousel);