class ClientService {
    constructor(knex) {
        this.knex = knex;
    }

    listindex(clientid) {
        let query = this.knex.select('shopname', 'status', 'quota', 'status', 'shopinfo.id', 'startdate', 'enddate').from('shopinfo')
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

    checkCredit(clientid) {
        let query = this.knex.select('credit').from('clientinfo')
            .where('id', clientid)

        return query
    }

    createNewShop(input, callback) {
        this.knex.transaction(async (trx) => {
            let today = new Date()
            let startdate = new Date(input.startdate)
            // Check if start date is earlier than today
            if (startdate.getTime() <= today.getTime()) {
                input.status = 'Live';
            }

            // count credit total, deduct it first
            let totalCredit = input.credit * input.quota
            //

            input.taken = [];

            await trx("shopinfo").insert(input);
            await trx('clientinfo').decrement('credit', totalCredit).where('id', input._clientid);

        }).then(callback).catch((e) => {
            return callback(new Error(e))
        }
        );
    }

    deleteShop(shopinfo, callback) {
        this.knex.transaction(async (trx) => {

            let totalCredit = shopinfo[0].credit * shopinfo[0].quota;
            await trx("shopinfo").where('id', shopinfo[0].id).del();
            await trx('clientinfo').increment('credit', totalCredit).where('id', shopinfo[0]._clientid);

        }).then(callback).catch((e) => {
            return callback(new Error(e))
        }
        );
    }

    listreviewJob(clientid) {
        let query = this.knex.select('jobinfo.id', 'jobinfo._shopperid', 'jobinfo._clientid', '_shopid', 'jobinfo.updated_at',
            'firstname', 'lastname', 'shopname').from('jobinfo')
            .where('jobinfo._clientid', clientid).andWhere('jobinfo.status', 'Review')
            .leftJoin('shopperinfo', 'jobinfo._shopperid', 'shopperinfo.id')
            .leftJoin('shopinfo', 'jobinfo._shopid', 'shopinfo.id')

        return query
    }

    listdetailJob(jobid) {
        let query = this.knex.select('jobinfo.id', 'jobinfo._shopperid', 'jobinfo._clientid', '_shopid', 'jobinfo.updated_at',
            'shopname', 'jobinfo.status', 'answer1', 'answer2', 'answer3', 'answer4',
            'question1', 'question2', 'question3', 'question4', 'jobinfo.status').from('jobinfo')
            .where('jobinfo.id', jobid)
            .leftJoin('shopinfo', 'jobinfo._shopid', 'shopinfo.id')

        return query
    }

    accecptJob(jobid, callback) {
        this.knex.transaction(async (trx) => {

            await trx('jobinfo').update({ status: 'Approve' }).where('id', jobid)

            await trx.select('credit','_shopperid').from('jobinfo').where('jobinfo.id', jobid)
                .leftJoin('shopinfo', 'jobinfo._shopid', 'shopinfo.id').then((result) => {
                    console.log(result)
                    trx('shopperinfo').increment('balance', result[0].credit).where('id', result[0]._shopperid).then((re)=>{
                        console.log(re)
                    })
                }
                )

        }).then(callback).catch((e) => {
            return callback(new Error(e))
        }
        );
    }

    rejectJob(jobid) {

        let query = this.knex('jobinfo').update({ status: 'Reject' }).where('id', jobid)

        return query

    }

    listallJob(clientid) {
        let query = this.knex.select('jobinfo.id', 'jobinfo._shopperid', 'jobinfo._clientid', '_shopid', 'jobinfo.updated_at',
        'firstname', 'lastname', 'shopname', 'jobinfo.status', 'shopinfo.credit').from('jobinfo')
        .where('jobinfo._clientid', clientid).whereNot('jobinfo.status', 'Review')
        .leftJoin('shopperinfo', 'jobinfo._shopperid', 'shopperinfo.id')
        .leftJoin('shopinfo', 'jobinfo._shopid', 'shopinfo.id')
        
        return query
    }

    checkUsername(username){
        let query = this.knex.select('username').from('clientinfo').where('username', username)

        return query
    }

    test(jobid) {
        let query = this.knex('shopperinfo').increment('balance', 100).where('id', 1)
        return query
    }


}

module.exports = ClientService;