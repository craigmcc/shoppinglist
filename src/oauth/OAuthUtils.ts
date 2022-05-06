// oauth-utils ---------------------------------------------------------------

// General utilities for the OAuth Orchestrator implementation.

// External Modules ----------------------------------------------------------

const bcrypt = require("bcrypt");
import crypto from "crypto";
import util from "util";

// Internal Modules ----------------------------------------------------------

const promisifiedRandomBytes = util.promisify(crypto.randomBytes);

// Public Objects ------------------------------------------------------------

/**
 * Generate and return a random token, with an optional specified length
 * in bytes, converted to hex encoding.
 *
 * @param desiredSize Desired number of bytes (hex will be this * 4 in length)
 */
export const generateRandomToken
    = async (desiredSize: number = 32): Promise<string> =>
{
    const buffer: Buffer = await promisifiedRandomBytes(desiredSize);
    return buffer.toString("hex");
}

/**
 * Perform a one-way hash on the specified password, and return the result
 * as a string.
 *
 * @param password      Plain-text password to be hashed
 */
export const hashPassword
    = async (password: string): Promise<string> =>
{
    const SALT_ROUNDS: number = 10;
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify that the specified plain-text password hashes to the specified
 * hash value.
 *
 * @param password      Plain-text password to be checked
 * @param hash          Hashed password previously calculated by hashPassword()
 */
export const verifyPassword
    = async (password: string, hash: string): Promise<boolean> =>
{
    return bcrypt.compare(password, hash);
}
