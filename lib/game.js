import '../settings.js';
import fs from 'fs';
import jimp from 'jimp';
import chalk from 'chalk';
import { sleep, clockString } from './function.js'

function pickRandom(list) {
	return list[Math.floor(list.length * Math.random())]
}

const rdGame = (bd, id, tm) => Object.keys(bd).find(a => a.startsWith(id) && a.endsWith(tm));

const iGame = (bd, id) => (a => a && bd[a].id)(Object.keys(bd).find(a => a.startsWith(id)));

const tGame = (bd, id) => (a => a && bd[a].time)(Object.keys(bd).find(a => a.startsWith(id)));

const gameSlot = async (conn, m, db) => {
	if (db.users[m.sender].limit < 1) return m.reply("🌸 ｡･ﾟ･｡ Limit kamu habis ya ｡ﾟ･｡")
	const sotoy = ['🍇','🍉','🍋','🍌','🍎','🍑','🍒','🫐','🥥','🥑']
	const slot1 = pickRandom(sotoy)
	const slot2 = pickRandom(sotoy)
	const slot3 = pickRandom(sotoy)
	const listSlot1 = `${pickRandom(sotoy)} : ${pickRandom(sotoy)} : ${pickRandom(sotoy)}`
	const listSlot2 = `${slot1} : ${slot2} : ${slot3}`
	const listSlot3 = `${pickRandom(sotoy)} : ${pickRandom(sotoy)} : ${pickRandom(sotoy)}`
	const randomLimit = Math.floor(Math.random() * 10)
	const botNumber = await conn.decodeJid(conn.user.id)
	try {
		if (slot1 === slot2 && slot2 === slot3) {
			db.users[m.sender].limit -= 1
			db.set[botNumber].limit += 1
			let sloth =`🌸･ﾟ *Slot* ･ﾟ🌸\n\n${listSlot1}\n${listSlot2} <=====\n${listSlot3}\n\nYeay menang 🎉\nLimit + ${randomLimit}, Uang + ${randomLimit * 500}`
			conn.sendMessage(m.chat, { text: sloth }, { quoted: m })
			db.users[m.sender].limit += randomLimit
			db.users[m.sender].money += randomLimit * 500
	} else {
			db.users[m.sender].limit -= 1
			db.set[botNumber].limit += 1
			let sloth =`🌸･ﾟ *Slot* ･ﾟ🌸\n\n${listSlot1}\n${listSlot2} <=====\n${listSlot3}\n\nAduh kalah ya ｡ﾟ･｡\nLimit - 1`
			conn.sendMessage(m.chat, { text: sloth }, { quoted: m })
	}
	} catch (e) {
		m.reply('🌸 ｡･ﾟ･｡ Ada error kecil ya ｡ﾟ･｡')
	}
}

const gameCasinoSolo = async (conn, m, prefix, db) => {
	try {
		let buatall = 1
		if (db.users[m.sender].limit < 1) return m.reply("🌸 ｡･ﾟ･｡ Limit kamu habis ya ｡ﾟ･｡")
		const botNumber = await conn.decodeJid(conn.user.id)
		let randomaku = `${Math.floor(Math.random() * 101)}`.trim()
		let randomkamu = `${Math.floor(Math.random() * 81)}`.trim()
		let Aku = (randomaku * 1)
		let Kamu = (randomkamu * 1)
		let count = m.args[0]
		count = count? 'all' === count? Math.floor(db.users[m.sender].money / buatall) : parseInt(count) : m.args[0]? parseInt(m.args[0]) : 1
		count = Math.max(1, count)
		if (m.args.length < 1) return m.reply(`🌸 ｡･ﾟ･｡ Pakai ${prefix}casino <jumlah> ya ｡ﾟ･｡\nContoh: ${prefix}casino 1000`)
		if (isNaN(m.args[0])) return m.reply(`🌸 ｡･ﾟ･｡ Masukkan jumlahnya ya ｡ﾟ･｡\nContoh: ${prefix + m.command} 1000`)
		if (db.users[m.sender].money >= count * 1) {
			db.users[m.sender].limit -= 1
			db.users[m.sender].money -= count * 1
			db.set[botNumber].money += count * 1
			if (Aku > Kamu) {
				m.reply(`🌸･ﾟ *Casino* ･ﾟ🌸\nKamu: ${Kamu} Point\nBot: ${Aku} Point\nKalah ya ｡ﾟ･｡\nKehilangan ${count} uang`)
			} else if (Aku < Kamu) {
				db.users[m.sender].money += count * 2
				m.reply(`🌸･ﾟ *Casino* ･ﾟ🌸\nKamu: ${Kamu} Point\nBot: ${Aku} Point\nMenang 🎉\nDapat ${count * 2} uang`)
			} else {
				db.users[m.sender].money += count * 1
				m.reply(`🌸･ﾟ *Casino* ･ﾟ🌸\nKamu: ${Kamu} Point\nBot: ${Aku} Point\nSeri ya\nUang kembali ${count * 1}`)
			}
	} else m.reply(`🌸 ｡･ﾟ･｡ Uang kamu nggak cukup buat main ｡ﾟ･｡`)
	} catch (e) {
		m.reply('🌸 ｡･ﾟ･｡ Ada error kecil ya ｡ﾟ･｡')
	}
}

const gameSamgongSolo = async (conn, m, db) => {
	const suits = ['♥️', '♦️', '♣️', '♠️'];
	const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
	if (db.users[m.sender].limit < 1) return m.reply("🌸 ｡･ﾟ･｡ Limit kamu habis ya ｡ﾟ･｡")
	const count = parseInt(m.args[0]);
	if (isNaN(count) || count < 5000) return m.reply('🌸 ｡･ﾟ･｡ Minimal taruhan 5000 ya ｡ﾟ･｡')
	if (db.users[m.sender].money < count) return m.reply(`🌸 ｡･ﾟ･｡ Uang kamu nggak cukup buat main samgong ｡ﾟ･｡`)
	db.users[m.sender].money -= count;
	db.users[m.sender].limit -= 1
	let { key } = await m.reply('🌸･ﾟ *Samgong* ･ﾟ🌸\nKartu lagi dibagikan ya...')
	await sleep(5000);
	const deck = ranks.flatMap(rank => suits.map(suit => `${rank} ${suit}`)).sort(() => Math.random() - 0.5);
	const draw = () => [deck.pop(), deck.pop(), deck.pop()];
	const calcScore = hand => hand.reduce((sum, card) => sum + (['J', 'Q', 'K'].includes(card.split(' ')[0])? 10 : card.split(' ')[0] === 'A'? 15 : parseInt(card)), 0);
	
	let playerHand = draw(), botHand = draw();
	let playerScore = calcScore(playerHand), botScore = calcScore(botHand);
	
	await m.reply(`Kartu kamu: ${playerHand.join(', ')}\nKartu bot: ${botHand.join(', ')}`, { edit: key });
	await sleep(2000);
	while (playerScore < 30 && botScore < 30 && playerHand.length < 4) {
		if (playerScore < 30) playerHand.push(deck.pop());
		if (botScore < 30) botHand.push(deck.pop());
		playerScore = calcScore(playerHand);
		botScore = calcScore(botHand);
	}
	
	let winnings = count * 1.5;
	let result = playerScore > 30? 'Aduh kamu kalah ｡ﾟ･｡' : playerScore === botScore? 'Seri ya, uang kembali' : botScore > 30 || playerScore > botScore? `Menang 🎉 +${winnings} uang` : 'Bot menang ya';
	if (playerScore <= 30 && (botScore > 30 || playerScore > botScore)) db.users[m.sender].money += (playerScore === botScore? count : winnings);
	await m.reply(`Hasil akhir:\nKamu: ${playerHand.join(', ')} (${playerScore})\nBot: ${botHand.join(', ')} (${botScore})\n\n${result}`, { edit: key })
}

const gameMerampok = async (m, db) => {
	if (db.users[m.sender].limit < 1) return m.reply("🌸 ｡･ﾟ･｡ Limit kamu habis ya ｡ﾟ･｡")
	db.users[m.sender].limit -= 1
	let __timers = (new Date - db.users[m.sender].lastrampok)
	let _timers = (3600000 - __timers)
	let timers = clockString(_timers)
	if (new Date - db.users[m.sender].lastrampok > 3600000) {
		let dapat = (Math.floor(Math.random() * 10000))
		let who
		if (m.isGroup) who = m.mentionedJid? m.mentionedJid[0] : m.quoted? m.quoted.sender : m.mentionedJid[0]
		else who = m.chat
		if (!who) return m.reply('🌸 ｡･ﾟ･｡ Tag orangnya dulu ya ｡ﾟ･｡')
		if (!db.users[who]) return m.reply('🌸 ｡･ﾟ･｡ Target belum terdaftar ｡ﾟ･｡')
		if (10000 > db.users[who].money) return m.reply('🌸 ｡･ﾟ･｡ Targetnya nggak punya uang banyak ｡ﾟ･｡')
		db.users[who].money -= dapat
		db.users[m.sender].money += dapat
		db.users[m.sender].lastrampok = new Date * 1
		m.reply(`Berhasil dapet ${dapat} uang dari target ya`)
	} else m.reply(`🌸 ｡･ﾟ･｡ Tunggu ${timers} dulu ya buat rampok lagi ｡ﾟ･｡`)
}

const gameBegal = async (conn, m, db) => {
	if (db.users[m.sender].limit < 1) return m.reply("🌸 ｡･ﾟ･｡ Limit kamu habis ya ｡ﾟ･｡")
	db.users[m.sender].limit -= 1
	let user = db.users[m.sender]
	let __timers = (new Date - user.lastbegal)
	let _timers = (3600000 - __timers)
	let timers = clockString(_timers)
	const botNumber = await conn.decodeJid(conn.user.id)
	const randomUang = Math.floor(Math.random() * 10001)
	let random = [
	{teks: 'Aduh dia kabur ｡ﾟ･｡', no: 0},
	{teks: 'Dia lari duluan', no: 0},
	{teks: 'Nggak ketemu orangnya', no: 0},
	{teks: 'Kamu ketahuan ｡ﾟ･｡', no: 2},
	{teks: 'Ketangkep deh', no: 2},
	{teks: 'Dia lebih kuat dari kamu', no: 1}
	]
	let teksnya = await pickRandom(random);
	if (new Date - user.lastbegal > 3600000) {
		let { key } = await m.reply('🌸･ﾟ *Begal* ･ﾟ🌸\nLagi cari target ya...')
		await sleep(2000)
		if (teksnya.no === 0) {
			await m.reply({ text: teksnya.teks, edit: key })
			await m.reply('Coba lagi ya')
	} else if (teksnya.no === 1) {
			await m.reply({ text: teksnya.teks, edit: key })
			await m.reply(`Kamu kalah, uang ${randomUang} diambil`)
			db.users[m.sender].money -= randomUang
			db.set[botNumber].money += randomUang * 1
	} else {
			await m.reply({ text: teksnya.teks, edit: key })
			await m.reply(`Berhasil dapet ${randomUang} uang ya`)
			db.users[m.sender].money += randomUang
			db.users[m.sender].lastbegal = new Date * 1
	}
	} else m.reply(`🌸 ｡･ﾟ･｡ Tunggu ${timers} dulu ya ｡ﾟ･｡`)
}

const daily = async (m, db) => {
	let user = db.users[m.sender]
	let __timers = (new Date - user.lastclaim)
	let _timers = (86400000 - __timers)
	let timers = clockString(_timers)
	if (new Date - user.lastclaim > 86400000) {
		m.reply(`🌸･ﾟ *Daily Claim* ･ﾟ🌸\nBerhasil claim ya\n+10 limit\n+10000 uang`)
		db.users[m.sender].limit += 10
		db.users[m.sender].money += 10000
		db.users[m.sender].lastclaim = new Date * 1
	} else m.reply(`🌸 ｡･ﾟ･｡ Tunggu ${timers} dulu ya buat claim lagi ｡ﾟ･｡`)
}

const buy = async (m, args, db) => {
	if (args[0] === 'limit') {
		if (!args[1]) return m.reply(`🌸 ｡･ﾟ･｡ Pakai ${m.prefix + m.command} limit 10 ya ｡ﾟ･｡`);
		let count = parseInt(args[1])
		if (db.users[m.sender].money >= count * 500) {
			db.users[m.sender].limit += count * 1
			db.users[m.sender].money -= count * 500
			m.reply(`Berhasil beli ${args[1]} limit dengan harga ${args[1] * 500}`)
	} else m.reply(`🌸 ｡･ﾟ･｡ Uang kamu nggak cukup ｡ﾟ･｡\nSisa uang: ${db.users[m.sender].money}`)
	} else m.reply(`🌸･ﾟ *Toko Limit* ･ﾟ🌸\n1 limit = 500 uang\nContoh: ${m.prefix}buy limit 3`)
}

const setLimit = (m, db) => db.users[m.sender].limit -= 1

const addLimit = (jumlah, no, db) => db.users[no].limit += parseInt(jumlah)

const setMoney = (m, db) => db.users[m.sender].money -= 1000

const addMoney = (jumlah, no, db) => db.users[no].money += parseInt(jumlah)

const transfer = async (m, args, db) => {
	if (args[0] == 'limit') {
		if (!args[1].length > 7) return m.reply(`🌸 ｡･ﾟ･｡ Contoh: ${m.prefix + m.command} limit @tag 10 ｡ﾟ･｡`);
		let count = parseInt(args[2] && args[2].length > 0? Math.min(9999, Math.max(parseInt(args[2]), 1)) : Math.min(1))
		let who = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : args[1]? (args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net') : false
		if (!who) return m.reply('🌸 ｡･ﾟ･｡ Mau transfer ke siapa ya? ｡ﾟ･｡')
		if (db.users[who]) {
			if (db.users[m.sender].limit >= count * 1) {
				try {
					db.users[m.sender].limit -= count * 1
					db.users[who].limit += count * 1
					m.reply(`Berhasil kirim ${count} limit ke @${who.split('@')[0]}`)
				} catch (e) {
					db.users[m.sender].limit += count * 1
					m.reply('🌸 ｡･ﾟ･｡ Gagal kirim ya ｡ﾟ･｡')
				}
			} else m.reply(`🌸 ｡･ﾟ･｡ Limit kamu nggak cukup ｡ﾟ･｡`)
	} else m.reply(`🌸 ｡･ﾟ･｡ Orang itu bukan user bot ｡ﾟ･｡`)
	} else if (args[0] == 'uang') {
		if (!args[1].length > 7) return m.reply(`🌸 ｡･ﾟ･｡ Contoh: ${m.prefix + m.command} uang @tag 1000 ｡ﾟ･｡`);
		let count = parseInt(args[2] && args[2].length > 0? Math.min(9999999, Math.max(parseInt(args[2]), 1)) : Math.min(1))
		let who = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : args[1]? (args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net') : false
		if (!who) return m.reply('🌸 ｡･ﾟ･｡ Mau transfer ke siapa ya? ｡ﾟ･｡')
		if (db.users[who]) {
			if (db.users[m.sender].money >= count * 1) {
				try {
					db.users[m.sender].money -= count * 1
					db.users[who].money += count * 1
					m.reply(`Berhasil kirim ${count} uang ke @${who.split('@')[0]}`)
				} catch (e) {
					db.users[m.sender].money += count * 1
					m.reply('🌸 ｡･ﾟ･｡ Gagal kirim ya ｡ﾟ･｡')
				}
			} else m.reply(`🌸 ｡･ﾟ･｡ Uang kamu nggak cukup ｡ﾟ･｡`)
	} else m.reply(`🌸 ｡･ﾟ･｡ Orang itu bukan user bot ｡ﾟ･｡`)
	} else m.reply(`🌸 ｡･ﾟ･｡ Pakai ${m.prefix + m.command} limit @tag jumlah atau uang @tag jumlah ya ｡ﾟ･｡`)
}

class Blackjack {
	constructor(data) {
		this.id = data.id || '';
		this.skip = data.skip || [];
		this.host = data.host || '';
		this.leader = data.leader || '';
		this.winner = data.winner || [];
		this.players = data.players || [];
		this.started = data.started || false;
		this.startCard = data.startCard || {};
		this.submitCard = data.submitCard || [];
		this.secondDeck = data.secondDeck || [];
		this.deck = data.deck || this.generateDeck();
	}
	
	generateDeck() {
		let deck = [];
		const suits = ['♥️', '♦️', '♣️', '♠️'];
		const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
		for (let suit of suits) {
			for (let rank of ranks) {
				deck.push({ rank: rank, suit: suit });
			}
	}
		return deck;
	}
	
	shuffleDeck() {
		for (let i = this.deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
	}
	}
	
	distributeCards() {
		this.shuffleDeck();
		for (let player of this.players) {
			player.cards.push(...this.deck.splice(0, { 2: 10, 3: 7, 4: 7, 5: 6, 6: 6, 7: 5, 8: 5, 9: 4, 10: 4 }[this.players.length]));
	}
		this.startCard = this.deck.shift();
		this.secondDeck.push(this.startCard);
		this.started = true;
	}
	
	hasMatching(player) {
		return this.players.find(p => p.id === player)?.cards?.some(card => card?.suit === this.startCard.suit) || false;
	}
	
	resolveRound() {
		const rankToValue = (rank) => rank === 'A'? 14 : rank === 'K'? 13 : rank === 'Q'? 12 : rank === 'J'? 11 : parseInt(rank) || 0;
		let highestCard = this.submitCard[0];
		let leaderId = highestCard.id;
		for (let c of this.submitCard) {
			if (rankToValue(c.card.rank) > rankToValue(highestCard.card.rank)) {
				highestCard = c;
				leaderId = c.id;
			}
	}
		if (leaderId) {
			this.leader = leaderId;
			this.startCard = {};
			this.submitCard = [];
			return `@${leaderId.split('@')[0]} giliran kamu ya`
	}
	}
	
	reuseSubmitCardsForDrinking() {
		const drinkers = this.players.filter(p =>!this.hasMatching(p.id) &&!this.skip.includes(p.id));
		const cards = this.submitCard.map(s => s.card);
		if ((this.submitCard.length + this.skip.length) === this.players.length && cards.length === 1) {
			const owner = this.submitCard[0].id;
			this.leader = owner;
			for (const player of this.players) {
				if (player.id!== owner) this.skip.push(player.id);
			}
			return {
				msg: `@${owner.split('@')[0]} jadi pemimpin ya`,
				continue: true
			}
	} else {
			let index = 0;
			for (const card of cards) {
				if (!drinkers.length) break;
				const player = this.players.find(p => p.id === drinkers[index % drinkers.length].id);
				player.cards.push(card);
				if (!this.skip.find(a => a.id === player.id)) this.skip.push({ id: player.id });
				index++;
			}
			return {
				msg: `Kartu udah dibagikan ya`,
				continue: true
			}
	}
	}
}

class SnakeLadder {
	constructor(data) {
		this.turn = data.turn || 0;
		this.host = data.host || null;
		this.start = data.start || false;
		this.players = data.players || [];
		this.map = data.map || this.createMap();
	}
	
	rollDice() {
		return Math.floor(Math.random() * 6) + 1;
	}
	
	createMap () {
		const data = [{
			url: 'https://raw.githubusercontent.com/nazedev/database/master/games/images/map1.jpg',
			move: { 4: 56, 12: 50, 14: 55, 22: 58, 41: 79, 54: 88, 96: 42, 94: 71, 75: 32, 48: 16, 37: 3, 28: 10 },
			mode: ''
	}, {
			url: 'https://raw.githubusercontent.com/nazedev/database/master/games/images/map2.jpg',
			move: { 7: 36, 21: 58, 31: 51, 34: 84, 54: 89, 63: 82, 96: 72, 78: 59, 66: 12, 56: 20, 43: 24, 33: 5 },
			mode: ''
	}];
		return data[Math.floor(Math.random() * data.length)];
	}
	
	nextTurn() {
		this.turn = (this.turn + 1) % this.players.length;
	}
	
	async drawBoard(boardUrl, players = []) {
		try {
			const board = await jimp.read(boardUrl);
			board.resize(612, 612);
			const width = board.getWidth();
			const height = board.getHeight();
			const size = Math.min(width, height);
			board.crop((width - size) / 2, (height - size) / 2, size, size);
			const tileSize = size / 10;
			players.filter(a => a.move!== null);
			for (let i = 0; i < players.length; i++) {
				const position = players[i].move;
				const row = Math.floor((position - 1) / 10);
				const col = (row % 2 === 0)? (position - 1) % 10 : 9 - (position - 1) % 10;
				const x = col * tileSize;
				const y = (9 - row) * tileSize;
				const player = await jimp.read(`https://raw.githubusercontent.com/nazedev/database/master/games/images/player${i + 1}.png`);
				const pionSize = tileSize * 0.7;
				player.resize(pionSize, pionSize);
				board.composite(player, x + tileSize / 2 - pionSize / 2, y + tileSize / 2 - pionSize / 2, {
					mode: jimp.BLEND_SOURCE_OVER
				});
			}
			const result = await board.getBufferAsync(jimp.MIME_JPEG);
			return result;
	} catch (e) {
			return null;
	}
	}
}

export {
	rdGame,
	iGame,
	tGame,
	gameSlot,
	gameCasinoSolo,
	gameSamgongSolo,
	gameMerampok,
	gameBegal,
	daily,
	buy,
	setLimit,
	addLimit,
	addMoney,
	setMoney,
	transfer,
	Blackjack,
	SnakeLadder
};