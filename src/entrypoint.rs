//entrypoint to the program
// no main function in solana programs but entrypoint macro

use solana_program::{
    account_info::AccountInfo,//description of a single account, to serialize/deserialize
    entrypoint,
    entrypoint::ProgramResult,
 //   msg,
    pubkey::Pubkey, //address of an account
};

/*entrypoint macro declare and export the program's entrypoint,
deserialize the program input arguments (program_id, accounts, instruction_data)
and call the process_instruction function*/
entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,// Public key of the account the program was loaded into
    accounts: &[AccountInfo],//accounts to interact with
    instruction_data: &[u8],//instruction to process
) -> ProgramResult {
    crate::processor::process_instruction(program_id, accounts, instruction_data)
}

