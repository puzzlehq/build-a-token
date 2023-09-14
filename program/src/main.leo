import multisig.leo;

program matt_token_v6.aleo {
  mapping account: address => u64;

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
