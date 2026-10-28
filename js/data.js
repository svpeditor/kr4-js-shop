// Товары магазина Клац. Каждый товар - объект с одинаковым набором свойств.
// Значения category совпадают с value в фильтре категорий на catalog.html.
const products = [
    {
        id: 1,
        title: 'Клац 60',
        category: 'keyboards',
        price: 5490,
        discountPercent: 0,
        rating: 4.8,
        isAvailable: true,
        image: 'images/klac-60.jpg',
        description: 'Компактная клавиатура на 61 клавишу со свитчами Gateron Yellow.'
    },
    {
        id: 2,
        title: 'Клац 65 Wood',
        category: 'keyboards',
        price: 12990,
        discountPercent: 0,
        rating: 4.9,
        isAvailable: true,
        image: 'images/klac-65-wood.jpg',
        description: 'Корпус из ореха, отдельные стрелки и кейкапы Кемпинг в комплекте.'
    },
    {
        id: 3,
        title: 'Клац TKL Graphite',
        category: 'keyboards',
        price: 9400,
        discountPercent: 15,
        rating: 4.7,
        isAvailable: true,
        image: 'images/klac-tkl-graphite.jpg',
        description: 'Без цифрового блока, тёмный корпус и тактильные свитчи Kailh Box Brown.'
    },
    {
        id: 4,
        title: 'Клац TKL Retro',
        category: 'keyboards',
        price: 8490,
        discountPercent: 0,
        rating: 4.6,
        isAvailable: true,
        image: 'images/klac-tkl-retro.jpg',
        description: 'Оранжевые и кремовые кейкапы в стиле старых компьютеров, линейные свитчи.'
    },
    {
        id: 5,
        title: 'Свитчи Cherry MX Green, 10 шт.',
        category: 'switches',
        price: 1190,
        discountPercent: 0,
        rating: 4.5,
        isAvailable: true,
        image: 'images/switches-mx-green.jpg',
        description: 'Тактильные свитчи со щелчком и усилием нажатия 80 г.'
    },
    {
        id: 6,
        title: 'Тестер свитчей, 6 видов',
        category: 'switches',
        price: 790,
        discountPercent: 0,
        rating: 4.8,
        isAvailable: true,
        image: 'images/switch-tester.jpg',
        description: 'Шесть популярных свитчей на подставке, чтобы выбрать свой ход клавиш.'
    },
    {
        id: 7,
        title: 'Кейкапы Orange, 110 шт.',
        category: 'keycaps',
        price: 3300,
        discountPercent: 10,
        rating: 4.4,
        isAvailable: true,
        image: 'images/keycaps-orange.jpg',
        description: 'Яркий набор из PBT-пластика для полноразмерных и TKL-клавиатур.'
    },
    {
        id: 8,
        title: 'Кейкапы Кемпинг, 140 шт.',
        category: 'keycaps',
        price: 4490,
        discountPercent: 0,
        rating: 4.7,
        isAvailable: true,
        image: 'images/keycaps-camp.jpg',
        description: 'Зелёные, бордовые и кремовые кейкапы с рисунками гор и палаток.'
    },
    {
        id: 9,
        title: 'Съёмник кейкапов',
        category: 'accessories',
        price: 390,
        discountPercent: 0,
        rating: 4.3,
        isAvailable: true,
        image: 'images/keycap-puller.jpg',
        description: 'Проволочный съёмник, чтобы снять кейкапы и не поцарапать корпус.'
    },
    {
        id: 10,
        title: 'Витой кабель USB-C',
        category: 'accessories',
        price: 1490,
        discountPercent: 0,
        rating: 4.6,
        isAvailable: false,
        image: 'images/cable-coiled.jpg',
        description: 'Кабель 1,5 м с пружиной и разъёмом-авиатором. Ждём новую поставку.'
    }
];
