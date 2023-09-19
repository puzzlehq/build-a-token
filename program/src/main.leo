import puzzle_account_v001.leo;

program matt_Token_v6.aleo {
  mapping account: address => u64;

  struct Message {
        field_1: field,
        field_2: field,
        field_3: field,
        field_4: field,
  }

  record Token {
    owner: address,
    amount: u64,
  }

  /* Mint */
  transition mint_public(public receiver: address, public amount: u64) {
    // Only OWNER_ADDRESS can mint
    assert_eq(self.caller, aleo1ml2xr6fawppd6uaf8gn95uy2fpqqg8gk74k0lu8na7uvayk64v8qu8hw5u);
    return then finalize(receiver, amount);
  }

  finalize mint_public(public receiver: address, public amount: u64) {
    let receiver_amount: u64 = Mapping::get_or_use(account, receiver, 0u64);
    Mapping::set(account, receiver, receiver_amount + amount);
  }

  transition mint_private(receiver: address, amount: u64) -> Token {
    // Only OWNER_ADDRESS can mint
    assert_eq(self.caller, aleo1ml2xr6fawppd6uaf8gn95uy2fpqqg8gk74k0lu8na7uvayk64v8qu8hw5u);
    return Token {
      owner: receiver,
      amount: amount,
    };
  }

  /* Transfer */
  transition transfer_public(public receiver: address, public amount: u64) {
    return then finalize(self.caller, receiver, amount);
  }

  finalize transfer_public(public sender: address, public receiver: address, public amount: u64) {
    let sender_amount: u64 = Mapping::get_or_use(account, sender, 0u64);
    Mapping::set(account, sender, sender_amount - amount);

    let receiver_amount: u64 = Mapping::get_or_use(account, receiver, 0u64);
    Mapping::set(account, receiver, receiver_amount + amount);
  }

  transition transfer_private(sender: Token, receiver: address, amount: u64, owner_rules: puzzle_account_v001.leo/OwnerRules.record, sigs: puzzle_account_v001.leo/Signatures.record) -> (Token, Token) {
    
    // Check Signatures in Signatures are valid && that signatures match what's required by account owner rules
    // PS: keeping this verbose for now for code clarity but can certainly shed lines of code

    // Step 1: Pull signatures data out of Signatures record
    let signatures_parent_tuple: (field, field, field, field, signature, address) = puzzle_account_v001.leo/consume_signatures_record(sigs);
    let message: Message = Message {
      field_1: signatures_parent_tuple.0,
      field_2: signatures_parent_tuple.1,
      field_3: signatures_parent_tuple.2,
      field_4: signatures_parent_tuple.3,
    };
    let signed_message: signature = signatures_parent_tuple.4;
    let signer_address: address = signatures_parent_tuple.5;

    // Step 2: Pull owner rules data out of OwnerRules record
    let owner_rules_parent_tuple: (u8, u8, address) = puzzle_account_v001.leo/consume_owner_rules_record(owner_rules);
    let m: u8 = owner_rules_parent_tuple.0;
    let n: u8 = owner_rules_parent_tuple.1;
    let signer_address_one: address = owner_rules_parent_tuple.2;


    // Step 3: Verify message in Signatures Record matches function call and program id rn
    // Can't do yet until have string support, self.program_id and self.function and cast str,u8,addr to field


    // Step 3: Verify signatures against message
    let signature_check: bool = true;
    let is_valid_sig: bool = signed_message.verify(signer_address,message);
    assert_eq(signature_check,is_valid_sig);
    
    // Step 4: Check # of signatures is equal to signatures required in owner rules
    // Would like unconstrained arrays and to be able to check length to fully do this for now just hardcoding to 1
    let num_of_signatures: u8 = 1u8;
    assert_eq(num_of_signatures, m);

    // Private Transfer Logic
    let difference: u64 = sender.amount - amount;

    let remaining: Token = Token {
      owner: sender.owner,
      amount: difference,
    };

    let transferred: Token = Token {
      owner: receiver,
      amount: amount,
    };

    return (remaining, transferred);
  }

  transition transfer_private_to_public(sender: Token, public receiver: address, public amount: u64) -> Token {
    let difference: u64 = sender.amount - amount;

    let remaining: Token = Token {
      owner: sender.owner,
      amount: difference,
    };

    return remaining then finalize(receiver, amount);
  }

  finalize transfer_private_to_public(public receiver: address, public amount: u64) {
    let receiver_amount: u64 = Mapping::get_or_use(account, receiver, 0u64);
    Mapping::set(account, receiver, receiver_amount + amount);
  }

  transition transfer_public_to_private(public receiver: address, public amount: u64) -> Token {
    let transferred: Token = Token {
      owner: receiver,
      amount: amount,
    };

    return transferred then finalize(self.caller, amount);
  }

  finalize transfer_public_to_private(public sender: address, public amount: u64) {
    let sender_amount: u64 = Mapping::get_or_use(account, sender, 0u64);
    Mapping::set(account, sender, sender_amount - amount);
  }
}
