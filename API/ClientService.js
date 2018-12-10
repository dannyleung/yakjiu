class ClientService {
    constructor(knex){
        this.knex = knex;
    }

    listindex(clientid) {
        let query = this.knex.select('shopname', 'status','quota','status','shopinfo.id','startdate','enddate').from('shopinfo')
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

    // createNewShop(input){
    //     let query = this.knex("shopinfo").insert(input)

    //     return query
    // }

    checkCredit(clientid){
        let query = this.knex.select('credit').from('clientinfo')
        .where('id', clientid)

        return query
    }

    createNewShop(input,callback){
        this.knex.transaction(async (trx) => {
            let today = new Date()
            let startdate = new Date(input.startdate)
            // Check if start date is earlier than today
            if(startdate.getTime() <= today.getTime()){
                input.status = 'Live';
            }

            // count credit total, deduct it first
            let totalCredit = input.credit * input.quota
            //

            await trx("shopinfo").insert(input);
            await trx('clientinfo').decrement('credit', totalCredit).where('id', input._clientid);
        
        }).then(callback).catch((e)=>
        {
            return callback(new Error(e))
        }
        );   
    }

}

module.exports = ClientService;