
export { createUser };

// in the future the user obj may have other 
// bits of information like an email or their
// theme preferences or other settings
// for now though, it's just a name
function createUser(name) {
    return { name };
}