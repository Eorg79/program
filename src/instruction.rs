//program instructions


use {
    crate::state::*,
    borsh::BorshDeserialize,
    solana_program::{
    //   instruction::{AccountMeta, Instruction},
      msg,
       program_error::ProgramError,
    //   pubkey::Pubkey,
    //   sysvar,
       },
    std::convert::TryInto,
   
};

pub enum MessageInstruction {
//accounts expected:
   //0.[signer] = the account of the person requesting the message program (the initializer)
   //1.[writable] = the data account that should be created before executing instruction to store state message 
   //2.[] the system program
    Write { post: [u8; 100] },
//accounts expected:    
   //0.[signer] = the account of the person requesting the message program (the initializer)
   //1.[writable] = the data account storing the state message 
    Delete,
}

impl MessageInstruction {
    
    /// Unpack inbound buffer to associated Instruction
    /// The expected format for input is a Borsh serialized vector
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        msg!("buffer from front: {:?}", input);
        
        let (&tag, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;//return option, then convert option to a result
        msg!("first from buffer: {:?}", &tag);
        
        Ok(match &tag {
            0 => Self::Write { post: Self::unpack_content(rest)?},
               
                
            1 => MessageInstruction::Delete,
            
            _ => return Err(ProgramError::InvalidInstructionData),
            })
    }

    fn unpack_content(input: &[u8]) -> Result<[u8; 100], ProgramError> {
        let content = input.try_into().or(Err(ProgramError::InvalidInstructionData))?;
        Ok(content)
    }
}

