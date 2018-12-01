class ClientService {
    constructor(knex){
        this.knex = knex;
    }

    listindex(clientid) {
        let query = this.knex.select('shopname', 'status','quota','status','shopinfo.id').from('shopinfo')
        .innerJoin('clientinfo', 'shopinfo._clientid', 'clientinfo.id')
        .where('clientinfo.id', clientid)

        return query
    }

    listdetails(shopid) {
        let query = this.knex.select().from('shopinfo')
        .where('shopinfo.id', shopid)
        // let query = this.knex.select().from('shopinfo')
        // .leftJoin('clientinfo', 'shopinfo._clientid', 'clientinfo.id')
        // .where('shopinfo.id', shopid)

        return query
    }

}

module.exports = ClientService;