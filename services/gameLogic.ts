
// This file is now a re-export or duplicate of tokens.ts logic to ensure consistency across the app.
// We use the exact same logic to prevent state mismatch.

import { getProgress as gp, saveProgress as sp, addTokens as at, spendTokens as st, unlockHardMode as uh, openPack as op, saveSticker as ss, addDuplicate as ad, tradeDuplicates as td, restorePassport as rp, getPassportCode as gpc, encodePassport as ep, decodePassport as dp } from './tokens';

export const getProgress = gp;
export const saveProgress = sp;
export const addTokens = at;
export const spendTokens = st;
export const unlockHardMode = uh;
export const openPack = op;
export const saveSticker = ss;
export const addDuplicate = ad;
export const tradeDuplicates = td;
export const restorePassport = rp;
export const getPassportCode = gpc;
export const encodePassport = ep;
export const decodePassport = dp;
