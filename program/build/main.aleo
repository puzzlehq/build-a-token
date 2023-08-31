program matt_token_v2.aleo;

record m_token:
    owner as address.private;
    amount as u64.private;


mapping account:
	key left as address.public;
	value right as u64.public;

function mint_public:
    input r0 as address.public;
    input r1 as u64.public;
    assert.eq self.caller aleo1726dd49l5u7tcqaqxksrk6pw5kfcdxvevvkas4j3lmns882frcxqp45h9j;

    finalize r0 r1;

finalize mint_public:
    input r0 as address.public;
    input r1 as u64.public;
    get.or_use account[r0] 0u64 into r2;
    add r2 r1 into r3;
    set r3 into account[r0];


function mint_private:
    input r0 as address.private;
    input r1 as u64.private;
    assert.eq self.caller aleo1726dd49l5u7tcqaqxksrk6pw5kfcdxvevvkas4j3lmns882frcxqp45h9j;
    cast r0 r1 into r2 as m_token.record;
    output r2 as m_token.record;


function transfer_public:
    input r0 as address.public;
    input r1 as u64.public;

    finalize self.caller r0 r1;

finalize transfer_public:
    input r0 as address.public;
    input r1 as address.public;
    input r2 as u64.public;
    get.or_use account[r0] 0u64 into r3;
    sub r3 r2 into r4;
    set r4 into account[r0];
    get.or_use account[r1] 0u64 into r5;
    add r5 r2 into r6;
    set r6 into account[r1];


function transfer_private:
    input r0 as m_token.record;
    input r1 as address.private;
    input r2 as u64.private;
    sub r0.amount r2 into r3;
    cast r0.owner r3 into r4 as m_token.record;
    cast r1 r2 into r5 as m_token.record;
    output r4 as m_token.record;
    output r5 as m_token.record;


function transfer_private_to_public:
    input r0 as m_token.record;
    input r1 as address.public;
    input r2 as u64.public;
    sub r0.amount r2 into r3;
    cast r0.owner r3 into r4 as m_token.record;
    output r4 as m_token.record;

    finalize r1 r2;

finalize transfer_private_to_public:
    input r0 as address.public;
    input r1 as u64.public;
    get.or_use account[r0] 0u64 into r2;
    add r2 r1 into r3;
    set r3 into account[r0];


function transfer_public_to_private:
    input r0 as address.public;
    input r1 as u64.public;
    cast r0 r1 into r2 as m_token.record;
    output r2 as m_token.record;

    finalize self.caller r1;

finalize transfer_public_to_private:
    input r0 as address.public;
    input r1 as u64.public;
    get.or_use account[r0] 0u64 into r2;
    sub r2 r1 into r3;
    set r3 into account[r0];
