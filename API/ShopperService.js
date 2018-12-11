class ShopperService {
    constructor(knex) {
        this.knex = knex;
    }

    listindexlist() {
        let query = this.knex.select('id', 'shopname', 'address', 'credit', 'startdate', 'enddate', 'quota', 'taken', 'status').from('shopinfo')
            .where('status', 'Live')

        return query
    }

    listdetails(shopid) {
        let query = this.knex.select().from('shopinfo')
            .where('shopinfo.id', shopid)

        return query
    }

    takejob(shopid, shopperid, clientid, callback) {
        this.knex.transaction(async (trx) => {
            console.log(shopperid)
            console.log(clientid)

            await trx("jobinfo").insert(
                {
                    _shopid: shopid,
                    _shopperid: shopperid,
                    _clientid: clientid
                }
            );
            await trx('shopinfo').update(
                {
                    taken: trx.raw('array_append(taken, ?)', [shopperid])
                }
            ).where('id', shopid);
            
            await trx('shopinfo').decrement('quota', 1).where('id', shopid);

        }).then(callback).catch((e) => {
            return callback(new Error(e))
        }
        );
    }

    checkClientID(shopid) {
        let query = this.knex.select().from('shopinfo')
            .where('shopinfo.id', shopid)

        return query
    }


    test(shopid, shopperid, clientid) {
        let query = this.knex('shopinfo').update(
                {
                    taken: this.knex.raw('array_append(taken, ?)', [shopperid])
                }
            ).where('id', shopid)

        return query
    }

}

module.exports = ShopperService;