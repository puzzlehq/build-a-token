// The 'multisig' program.
program multisig.aleo {

    // what do we want this program to do?
    // let's consider simple case: 1 of 1

    // todo: for signers > 1:
    // need to generate new addr on the fly
    // store multiple signatures

    struct MofN {
        m: u8,
        n: u8,
    }

    struct OwnerAddr {
        owner_address: address,
    }

    struct SigsVerification {
        sig: signature,
        signer_address: address,
    }

    struct Message {
        field_1: field,
        field_2: field,
        field_3: field,
        field_4: field,
    }

    record owner_rules {
        owner: address,
        m_of_n: MofN,
        owner_addresses: OwnerAddr,
    }

    record signatures {
        owner: address,
        message: Message,
        signatures: SigsVerification,
    }

    transition mint_owner_record () -> owner_rules {
        return owner_rules {
            owner: self.caller,
            m_of_n: MofN {
                m: 1u8,
                n: 1u8,
            },
            owner_addresses: OwnerAddr {
                owner_address: self.caller,
            },
        };
    }

    // todo: crux of the issue?
    // need all the inputs to generate the message
    // owner_rules does not matter, we can just mint that. but signatures record?
    // how can we generate a message, if we don't even have the signature record yet?
    // is the message that we generate based on the inputs?

    transition verify_and_mint_signature(s: signature, a: address, m: Message) -> signatures {
        // validate that the caller is trying to validate his addr
        assert_eq(self.caller, a);
        let verify_check: bool = true;
        // verify sig
        let verified: bool = signature::verify(s, a, m);
        assert_eq(verified, verify_check);
        // let sigsVerified: SigsVerification = SigsVerification {
        //     signed_message: s,
        //     signer_address: a,
        // };
        return signatures {
            owner: a,
            message: m,
            signatures: SigsVerification {
                sig: s,
                signer_address: self.caller,
            }
        };
    }
}