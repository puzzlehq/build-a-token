import multisig.leo;

program matt_token_v6.aleo {
  mapping account: address => u64;

  // struct SignsArr {
  //   signed_message: signature,
  //   signer_address: address,
  // }

  // struct MofN {
  //   m: u8,
  //   n: u8,
  // }

  // struct OwnerArr {
  //   owner_address: address,
  // }

  // record Signatures {
  //   owner: address,
  //   message: field,
  //   signs_arr: SignsArr,
  // }

  // record OwnerRules {
  //   owner: address,
  //   m_of_n: MofN,
  //   owner_addresses: OwnerArr,
  // }

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

  transition transfer_private(sender: Token, receiver: address, amount: u64, sigs: multisig.leo/Signatures.record,
  owner_rules: multisig.leo/OwnerRules.record) -> (Token, Token) {
    // Check message in signatures struct matches message here
    // Can't do yet until have string support, self.program_id and self.function and cast str,u8,addr to field

    // Check Signatures in Signatures are valid
    let signature_check: bool = true;
    let signer_address: address = sigs.signatures.signer_address;
    let signed_message: signature = sigs.signatures.signed_message;
    let is_valid_sig: bool = signed_message.verify(signer_address, sigs.message);
    assert_eq(signature_check,is_valid_sig);

    // Check signer addresses match owner rules addresses
    let owner_address: address = owner_rules.owner_addresses.owner_address;
    assert_eq(signer_address,owner_address);

    // Check # of signatures is equal to signatures required in owner_rules
    // Would like unconstrained arrays and to be able to check length to fully do this
    // for now just hardcoding to 1
    let num_of_signatures: u8 = 1u8;
    let m: u8 = owner_rules.m_of_n.m;
    assert_eq(num_of_signatures, m);

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
