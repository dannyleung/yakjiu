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

    listallpendingjob(shopperid) {
        let query = this.knex.select('jobinfo.id','_shopperid','jobinfo._clientid','_shopid','address',
        'startdate','enddate','shopname','credit').from('jobinfo')
        .where('jobinfo.status', 'Pending').andWhere('jobinfo._shopperid', shopperid)
        .leftJoin('shopinfo', 'jobinfo._shopid', 'shopinfo.id')

        return query
    }

    listalljobdetails(jobid, shopperid) {
        let query = this.knex.select('jobinfo.id','_shopperid','jobinfo._clientid','_shopid','answer1','answer2','answer3','answer4',
        'jobinfo.status','payment','jobinfo.created_at','jobinfo.updated_at','address',
        'startdate','enddate','taken','question1','question2','question3','question4','shopname','description').from('jobinfo')
        .where('jobinfo.id', jobid).andWhere('jobinfo._shopperid', shopperid)
        .leftJoin('shopinfo', 'jobinfo._shopid', 'shopinfo.id')

        return query
    }

    updateSurvey(jobid, input, callback) {

        this.knex.transaction(async (trx) => {

            await trx("jobinfo").update(input).where('id', jobid)
            await trx("jobinfo").update({status: 'Review'}).where('id', jobid)

        }).then(callback).catch((e) => {
            return callback(new Error(e))
        }
        );

    }

    listJobHistory(shopperid) {
        let query = this.knex.select('jobinfo.id','_shopperid','jobinfo._clientid','_shopid','address',
        'startdate','enddate','shopname','credit','jobinfo.status').from('jobinfo')
        .whereNot('jobinfo.status', 'Pending').andWhere('jobinfo._shopperid', shopperid)
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