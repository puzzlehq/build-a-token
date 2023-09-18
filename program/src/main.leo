import multisig.leo;

program matt_token_v6.aleo {
  mapping account: address => u64;

  // struct Message_2 {
  //       field_1: field,
  //       field_2: field,
  //       field_3: field,
  //       field_4: field,
  // }

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

  record token {
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

  transition mint_private(receiver: address, amount: u64) -> token {
    // Only OWNER_ADDRESS can mint
    assert_eq(self.caller, aleo1ml2xr6fawppd6uaf8gn95uy2fpqqg8gk74k0lu8na7uvayk64v8qu8hw5u);
    return token {
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


// signatures record
// Owner_Rules Record..
// {
//   owner: aleo1ml2xr6fawppd6uaf8gn95uy2fpqqg8gk74k0lu8na7uvayk64v8qu8hw5u.private,
//   m_of_n: {
//     m: 1u8.private,
//     n: 1u8.private
//   },
//   owner_addresses: {
//     owner_address: aleo1ml2xr6fawppd6uaf8gn95uy2fpqqg8gk74k0lu8na7uvayk64v8qu8hw5u.private
//   },
//   _nonce: 4019547848688729640594437604272829685474077619781653868004802165491888846735group.public
// }

  transition transfer_private(sender: token, receiver: address, amount: u64) -> (token, token) {
    let difference: u64 = sender.amount - amount;

    let remaining: token = token {
      owner: sender.owner,
      amount: difference,
    };

    let transferred: token = token {
      owner: receiver,
      amount: amount,
    };

    return (remaining, transferred);
  }

  transition transfer_private_ms(sender: token, receiver: address, amount: u64, sigs: multisig.leo/signatures.record,
  owner_rul: multisig.leo/owner_rules.record) -> (token, token) {
    // Check message in signatures struct matches message here
    // Can't do yet until have string support, self.program_id and self.function and cast str,u8,addr to field

    // Check Signatures in Signatures are valid
    let signature_check: bool = true;
    let sigs_verify: multisig.leo/SigsVerification = sigs.signatures;
    let signer_address: address = sigs_verify.signer_address;
    let sig: signature = sigs_verify.sig;
    let is_valid_sig: bool = sig.verify(self.caller, sigs.message);
    assert_eq(signature_check, is_valid_sig);

    // Check signer addresses match owner rules addresses
    let owner_address: address = owner_rul.owner_addresses.owner_address;
    assert_eq(self.caller, owner_address);

    // Check # of signatures is equal to signatures required in owner_rules
    // Would like unconstrained arrays and to be able to check length to fully do this
    // for now just hardcoding to 1
    let num_of_signatures: u8 = 1u8;
    let m: u8 = owner_rul.m_of_n.m;
    assert_eq(num_of_signatures, m);

    let difference: u64 = sender.amount - amount;

    let remaining: token = token {
      owner: sender.owner,
      amount: difference,
    };

    let transferred: token = token {
      owner: receiver,
      amount: amount,
    };

    return (remaining, transferred);
  }

  transition transfer_private_to_public(sender: token, public receiver: address, public amount: u64) -> token {
    let difference: u64 = sender.amount - amount;

    let remaining: token = token {
      owner: sender.owner,
      amount: difference,
    };

    return remaining then finalize(receiver, amount);
  }

  finalize transfer_private_to_public(public receiver: address, public amount: u64) {
    let receiver_amount: u64 = Mapping::get_or_use(account, receiver, 0u64);
    Mapping::set(account, receiver, receiver_amount + amount);
  }

  transition transfer_public_to_private(public receiver: address, public amount: u64) -> token {
    let transferred: token = token {
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
