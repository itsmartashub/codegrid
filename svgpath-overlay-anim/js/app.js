// SETUP
// gsap.registerPlugin(CSSRulePlugin)
const tl = gsap.timeline({ paused: true })

let path = document.querySelector('path')
// let spanBefore = CSSRulePlugin.getRule('#hamburger span::before')

// console.log(spanBefore)

gsap.set('#hamburger', { '--burger-span-before-bgcolor': '#000' })
gsap.set('.menu', { visibility: 'hidden' })

// TOGGLE MENU
function revealMenu() {
	revealMenuItems()

	const toggleBtn = document.getElementById('toggle-btn')
	const hamburger = document.getElementById('hamburger')

	toggleBtn.addEventListener('click', (e) => {
		e.preventDefault()

		hamburger.classList.toggle('active')
		tl.reversed(!tl.reversed())
	})
}
revealMenu()

function revealMenuItems() {
	const start = 'M0 502S175 272 500 272s500 230 500 230V0H0Z'
	const end = 'M0,1005S175,995,500,995s500,5,500,5V0H0Z'
	const power2 = 'power2.inOut'
	const power4 = 'power4.inOut'

	tl.to('#hamburger', {
		marginTop: '-5px',
		x: -40,
		y: 40,
		duration: 1.25,
		ease: power4,
	})

	tl.to(
		'#hamburger span',
		{
			backgroundColor: '#e2e2dc',
			duration: 1,
			ease: power2,
		},
		'<'
	)
	tl.to(
		'#hamburger',
		{
			'--burger-span-before-bgcolor': '#e2e2dc',
			duration: 1,
			ease: power2,
		},
		'<'
	)

	tl.to(
		'.btn .btn__outline',
		{
			x: -40,
			y: 40,
			width: '140px',
			height: '140px',
			border: '1px solid #e2e2dc',
			duration: 1.25,
			ease: power4,
		},
		'<'
	)

	tl.to(
		path,
		{
			attr: {
				d: start,
			},
			duration: 0.8,
			ease: 'power2.in',
		},
		'<'
	).to(
		path,
		{
			attr: {
				d: end,
			},
			duration: 0.8,
			ease: 'power2.out', // 💥💥💥💥 OVDE SAM STAVILA ISTO in, tj 'power2.in', I ONDA JE KATASTROFALNO!! ONI CRNI AFTER PSEUDO ELEMENTI NA LINKOVIMA SU CRNI I VIDE SE I BAGUJE SVE NEKAKO. END tj OVAJ DRUGI, KADA SVG PATH SE NESTAJE, MORA DA BUDE out tj 'power2.out' !!!!! PROSTO NMG DA VERUJEM DA EASE TO MOZE DA UCINI
		},
		'-=0.5'
	)

	tl.to('.menu', { visibility: 'visible', duration: 1 }, '-=0.5')

	tl.to(
		'.menu__item > a',
		{
			top: 0,
			duration: 1,
			stagger: {
				amount: 0.5,
			},
			ease: 'power3.out',
		},
		'-=1'
	).reverse()
}

// HOW TO REVEAL
