# Run two nodes
$ node bin/pankycoin.js -p 3001 --name 1
$ node bin/pankycoin.js -p 3002 --name 2 --peers http://localhost:3001 --feeAddress bb2b7368b1443ca1966fae28336eb0103246a59370979205d248ea4c26a8baba

# Mine a block to the address 1 so we can have some coins
$ curl -X POST --header 'Content-Type: application/json' -d '{ "rewardAddress": "bb2b7368b1443ca1966fae28336eb0103246a59370979205d248ea4c26a8baba" }' 'http://localhost:3001/miner/mine'

# Xem Video demo để biết cách sử dụng