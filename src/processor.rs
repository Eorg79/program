//main business logic of the program, functions corresponding to instructions

use {
    borsh::{BorshDeserialize, BorshSerialize},
    crate::{instruction::*, state::*},
    solana_program::{
        account_info::{next_account_info, AccountInfo},
        entrypoint::ProgramResult,
       // feature::{self, Feature},
        msg,
        program::invoke,
        program_error::ProgramError,
        pubkey::Pubkey,
        system_instruction,
        system_program::ID as SYSTEM_PROGRAM_ID,
        sysvar::{clock::Clock, rent::Rent, Sysvar},
        },
};

//instruction processor
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
   
    //creating iterator to safely reference accounts in the slice
    let accounts_info_iter = &mut accounts.iter();

    //deserialize instruction 
    let instruction = MessageInstruction::unpack(instruction_data)?;
    
    match instruction {

       MessageInstruction::Write { post } => { 
      
        //Fectching and checking acccounts info

        //get the account initializing the transaction info
        let initializer_account_info = next_account_info(accounts_info_iter)?;
        //check if the initializer account has signed transaction
        if !initializer_account_info.is_signer {
            msg!("mismatching signature");
            return Err(ProgramError::MissingRequiredSignature);
        }

        //get the message account to store post info
        let message_account_info = next_account_info(accounts_info_iter)?;
        msg!("message account info {:?} ", message_account_info);

        //get the system_program
        let system_program_info = next_account_info(accounts_info_iter)?;
        
        // Check if the system program is valid
        if system_program_info.key.ne(&SYSTEM_PROGRAM_ID) {
           return Err(ProgramError::IncorrectProgramId);
         }
      
        //check if data is empty
        if !message_account_info.data_is_empty() {
            msg!("message_account data not empty");
            return Err(ProgramError::InvalidAccountData);
        }
        
        //check if owned by sys prog
        if message_account_info.owner != &SYSTEM_PROGRAM_ID {
            msg!("message_account not owned by system program");
            return Err(ProgramError::IllegalOwner);
        }

        //check if 0 lamport
        if message_account_info.lamports() != 0 {
            msg!("message_account already funded");
            return Err(ProgramError::InvalidAccountData);
        }
       
        
      
        //creating the data account to store message state;
        let rent = Rent::default();
        invoke( //to invoke a cross program instruction, because we need to invoke an instruction of the native program system program. two parameters &instruction and [&account_info]
             &system_instruction::create_account(
                 &initializer_account_info.key, //from
                 &message_account_info.key, //to 
                 1.max(rent.minimum_balance(141)),//Message::get_packed_len())), //lamports
                 141 as u64,//Message::get_packed_len() as u64, //space, number of bytes of memory to allocate
                 &program_id, //owner
             ),
             &[
                 initializer_account_info.clone(),//funding account
                 message_account_info.clone(),//new account
                 system_program_info.clone(),
             ],
         )?;
        msg!("account message created");

        //check if the state account has already been initialized
        let message_data = Message::try_from_slice(&message_account_info.data.borrow()).unwrap();
        if message_data.is_initialized {
            msg!("Already initialized");
            return Err(ProgramError::AccountAlreadyInitialized);
        };
        
        //populating and packing message to store in account state
         let clock = Clock::get()?;
         let current_timestamp = clock.unix_timestamp;
         let message = Message {
            author: *initializer_account_info.key,
            sentence: post,
            timestamp: current_timestamp,
            is_initialized: true,
         };
         msg!("new message  is {:?}", message);     
       
        //serialize 
        let _= message.serialize(&mut &mut *message_account_info.data.borrow_mut());
         
        Ok(())

        },

        MessageInstruction::Delete => {
          
        //get the account initializing the transaction info
        let initializer_account_info = next_account_info(accounts_info_iter)?;
        //check if the initializer account has signed transaction
       
        //get the message account to close
        let message_account_info = next_account_info(accounts_info_iter)?;
        msg!("message account info {:?} ", message_account_info);

        //check if the message account is owned by the current program
        if message_account_info.owner != program_id {
            msg!("mismatching account/program id");
            return Err(ProgramError::IllegalOwner);
        }
        
        //check if the state account is writable
        if !message_account_info.is_writable {
            msg!("account not writable");
            return Err(ProgramError::InvalidArgument);
        }
    
        //deserialize state account to check if initalizer account is owner
        let message_data = Message::try_from_slice(&message_account_info.data.borrow()).unwrap();
        if message_data.author != *initializer_account_info.key {
            msg!("initializer is not the author");
            return Err(ProgramError::InvalidArgument);
        };

        let initializer_starting_lamports = initializer_account_info.lamports();

        **initializer_account_info.lamports.borrow_mut() = initializer_starting_lamports.checked_add(message_account_info.lamports()).unwrap();
        **message_account_info.lamports.borrow_mut() = 0;

        let mut message_data = message_account_info.data.borrow_mut();
        message_data.fill(0);
        msg!("message deleted");
        
        Ok(())    
        },

        _ => Err(ProgramError::InvalidInstructionData),
            
        }
}
