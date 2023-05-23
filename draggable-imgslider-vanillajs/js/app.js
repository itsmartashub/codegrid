/*
In principle, a lerp function “eases” the transition between two values over time, using some simple math. This could be used to slide a character between two coordinates, or to animate a change in size or opacity of a UI element. If you lerped between two colors, you’d get a gradient. 

lerp(a, b, t) = a + (b - a) * t
    a: Start
    (b - a): Distance from A to B
    t: Percentage
    b: je mozda End ako je (B-A) razdaljina izmedju A i B

🔗 https://medium.com/swlh/youre-using-lerp-wrong-73579052a3c3
*/
const lerp = (f0, f1, t) => {
	console.log(f0, f1, t)

	return (1 - t) * f0 + t * f1
} // Linear interpolation

const clamp = (val, min, max) => Math.max(min, Math.min(val, max))

class DragScroll {
	constructor(obj) {
		// console.log(obj)
		// console.log(document.querySelectorAll(obj.item))
		this.el = document.querySelector(obj.el)
		this.wrap = document.querySelector(obj.wrap)
		this.items = document.querySelectorAll(obj.item)
		this.bar = document.querySelector(obj.bar)

		this.init()
	}

	init() {
		this.progress = 0
		this.speed = 0
		this.oldX = 0
		this.x = 0
		this.playrate = 0

		this.bindings()
		this.events()
		this.calculate()
		this.raf()
	}

	bindings() {
		const arrEvents = [
			'events',
			'calculate',
			'raf',
			'handleWheel',
			'move',
			'handleTouchStart',
			'handleTouchMove',
			'handleTouchEnd',
		]
		arrEvents.forEach((method) => {
			this[method] = this[method].bind(this)
		})
	}

	calculate() {
		// progress je 0. i recimo da smo skrolovali do pola, i onda risajzujemo browser, on resetuje progres na 0
		this.progress = 0

		// sirina wrappera: izvlacim sirinu jednog itema/slike (tu ide i padding kad kor clientWidth), i mnozim je sa onim brojem koliko ima itema/slika
		this.wrapWidth = this.items[0].clientWidth * this.items.length

		// (re)setujemo sirinu .slider__wrapper (dakle ne ona prilikom ucitavanja css-a, vec dinamicka)
		this.wrap.style.width = `${this.wrapWidth}px`

		/* koliko max moze da se skroluje: kada od sirine wrappera oduzmemo sirinu .slidera, wtf

        naime, .slider__wrapper ce biti siri od .slidera, iako mu ovaj parent, jer .slider ide do kraja vw, a .slider__wrapper overflowuje parenta tj .slider koliko god ima itema u sebi. zato kada racunamo koliko max moze da se skroluje, oduzimamo od ovog .slider__wrappera sirinu .slider-a */
		this.maxScroll = this.wrapWidth - this.el.clientWidth

		console.log('calculate() this.wrapWidth: ' + this.wrapWidth) // npr 2340
		console.log('calculate() this.el.clientWidth: ' + this.el.clientWidth) // npr 584
		console.log('calculate() this.maxScroll: ' + this.maxScroll) // npr 1756, a inace, toliki je i onda moguc maximalan this.progress
		console.log('==============================')
	}

	handleWheel(e) {
		this.progress += e.deltaY

		console.log('handleWheel() this.progress: ' + this.progress)
		console.log('handleWheel() e.deltaY: ' + e.deltaY)
		console.log('==============================')

		this.move()
	}
	move() {
		this.progress = clamp(this.progress, 0, this.maxScroll) // (val, min, max), tipa (trenutna_vrednost, min, max)
	}

	handleTouchStart(e) {
		e.preventDefault()

		this.dragging = true

		// pocetna pozicija draga tamo gde je trenutnog eventa clientX, ili za touch uredjaje, tj tamo gde nam je trnutno mis/touch, ako je na
		this.startX = e.clientX || e.touches[0].clientX

		console.log('handleTouchStart() this.startX: ' + this.startX)
		console.log('==============================')
	}
	handleTouchMove(e) {
		if (!this.dragging) return false

		let dragSpeed = 2.5

		const x = e.clientX || e.touches[0].clientX

		console.log('handleTouchMove() this.startX pre this.startX = x : ' + this.startX)

		this.progress += (this.startX - x) * dragSpeed // ????

		this.startX = x // samo je za 1px manja, wtf. osim ako ne provucem vise/brze
		this.move()

		console.log('handleTouchMove() x: ' + x)
		console.log('handleTouchMove() this.progress: ' + this.progress)
		console.log('handleTouchMove() this.startX: ' + this.startX)
		console.log('==============================')
	}
	handleTouchEnd() {
		this.dragging = false
	}

	events() {
		window.addEventListener('resize', this.calculate)
		window.addEventListener('wheel', this.handleWheel)

		// touch events
		window.addEventListener('touchstart', this.handleTouchStart)
		window.addEventListener('touchmove', this.handleTouchMove)
		window.addEventListener('touchend', this.handleTouchEnd)

		// mouse events | the same as touch
		window.addEventListener('mousedown', this.handleTouchStart)
		window.addEventListener('mousemove', this.handleTouchMove)
		window.addEventListener('mouseup', this.handleTouchEnd)
		document.body.addEventListener('mouseleave', this.handleTouchEnd)
	}

	raf() {
		this.x = lerp(this.x, this.progress, 0.1) // max vrednost je 1755.9999999999986 tj max sirina wrap-a tj max vrednost this.progresa
		this.playrate = this.x / this.maxScroll // max vrednost je 0.9999999999999992

		console.log('raf() this.x: ' + this.x)
		console.log('raf() this.playrate: ' + this.playrate)
		console.log('==============================')

		// this.wrap.style.transform = `translatex(${this.x}px)` // AHHAHA
		this.wrap.style.transform = `translatex(${-this.x}px)`

		/* 
        ovo 0.18 je kao 1 - 0.82, tj ovih 0.82,kojim mnozimo playrate, w t f. kad obrisem 0.18, onda je bar 0. a kad obrisem 0.82 onda kad skrolam do kraja, bar je preko svog parenta. al bitno je da taj prvi broj i ovaj kojim mnozimo zajedno daju 1 */
		this.bar.style.transform = `scaleX(${0.18 + this.playrate * 0.82})`

		console.log('raf() this.oldX pre this.oldX = this.x: ' + this.oldX)
		this.speed = Math.min(100, this.oldX - this.x)
		this.oldX = this.x

		console.log('raf() this.oldX: ' + this.oldX)
		console.log('raf() this.speed: ' + this.speed)

		console.log('raf() this.scale: pre reset: ' + this.scale)
		this.scale = lerp(this.scale, this.speed, 0.1) // nzm cemu ovo, kad je this.scale NaN
		console.log('raf() this.scale: ' + this.scale)

		this.items.forEach((item) => {
			// kad se skroluje parent slike se skejluje ispod 1 (smanjuje)
			item.style.transform = `scale(${1 - Math.abs(this.speed) * 0.005})`

			// kad se skroluje slika se skejluje preko 1 (povecava) u X pravcu (levo-desno)
			item.querySelector('img').style.transform = `scaleX(${1 + Math.abs(this.speed) * 0.004})`
		})
	}
}

const scroll = new DragScroll({
	el: '.slider',
	wrap: '.slider__wrapper',
	item: '.slider__item',
	bar: '.slider__progress__bar',
})
// console.log(scroll)

const animateScroll = () => {
	requestAnimationFrame(animateScroll)
	scroll.raf()
}
animateScroll()
