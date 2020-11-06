'use strict';

const { v4: uuidv4 } = require('uuid');

const { Contract } = require('fabric-contract-api');


class testContract extends Contract {



  async queryMarks(ctx, studentId) {

    let marksAsBytes = await ctx.stub.getState(studentId);
    if (!marksAsBytes || marksAsBytes.toString().length <= 0) {
      throw new Error('Student with this Id does not exist: ');
    }
    let marks = JSON.parse(marksAsBytes.toString());

    return JSON.stringify(marks);
  }

  async addMarks(ctx, studentId, subject1, subject2, subject3) {

    // let sId = studentId, s1 = subject1, s2 = subject2, s3 = subject3;

    let marks = {
      subj1: subject1,
      subj2: subject2,
      subj3: subject3
    };



    let testmarks = {
      type: 'static-marks',
      subj1: marks.subj1,
      subj2: marks.subj2,
      subj3: marks.subj3
    };

    //let studentkey = `studentId~subj1`
    // let studentIndexKey = await ctx.stub.createCompositeKey(studentId, [JSON.stringify(marks.subj1), JSON.stringify(marks.subj1), JSON.stringify(marks.subj1)]);

    //let studentIndexKey = await ctx.stub.createCompositeKey(studentkey, [sId, s1]);


    await ctx.stub.putState(studentId, Buffer.from(JSON.stringify(marks)));

    //================================================================================  MY EVENT STARTS HERE  =====================================================
    await ctx.stub.setEvent('myFirstEvent', Buffer.from(JSON.stringify(testmarks)));

    //let new_studentIndexKey = studentIndexKey.replace(/\u0000/g, '')

    //await ctx.stub.putState(studentIndexKey, Buffer.from('\u0000'));
    //console.log('Type:::::::::::;', typeof Buffer.from(JSON.stringify({})))
    //await ctx.stub.putState(new_studentIndexKey, Buffer.from(JSON.stringify(marks)));

    //console.log(studentIndexKey);
    //await ctx.stub.putState(studentIndexKey, Buffer.from(JSON.stringify(marks)));

    console.log('Student Marks added To the ledger Succesfully..');

  }


  async deleteMarks(ctx, studentId) {

    await ctx.stub.deleteState(studentId);

    console.log('Student Marks deleted from the ledger Succesfully..');

  }

  //voltuswave Transactions

  async voltusPost(ctx, object) {

    var myuid = uuidv4();

    let sendobj = {
      vwobj: object
    };

    await ctx.stub.putState(myuid, Buffer.from(JSON.stringify(sendobj)));

    //Voltus Event Starts Here  

    await ctx.stub.setEvent('VoltusEvent', Buffer.from(JSON.stringify(sendobj)));

    console.log('VW Object is added To the ledger Succesfully..');

  }
}

module.exports = testContract;

