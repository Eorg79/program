// program state
// define the type of state stored in accounts. 
use {
    borsh::{BorshDeserialize, BorshSerialize},
    solana_program::{
    pubkey::Pubkey,
//    msg,
//    program_error::ProgramError,
//    program_pack::{IsInitialized, Pack, Sealed},
  }
};

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Message {  
    pub author: Pubkey,
    pub sentence: [u8;100],
    pub timestamp: i64,
    pub is_initialized : bool,
}

impl Message {
  
  pub fn set_initialized(&mut self) {
    self.is_initialized = true;
  }
}




/*
impl Sealed for Message {} // equivalent to size trait for solana

// Pack expects the implementation to satisfy whether the
// account state is initialized.
impl IsInitialized for Message {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl Pack for Message {
    const LEN: usize = 141; // length in bytes of the packed representation 32+100+8+1

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let data = self.try_to_vec().unwrap();
        dst[..data.len()].copy_from_slice(&data);
    }

  //state of account passed into the entrypoint deserialization 
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let mut mut_src: &[u8] = src;
        Self::deserialize(&mut mut_src).map_err(|err| {
            msg!(
                "Error: failed to deserialize message account: {}",
                err
            );
            ProgramError::InvalidAccountData
        })
    }

} */