// @ts-nocheck
export const saveTokenToCtx = (ctx, token) => {
    ctx.session = {...ctx.session, user: { token } }
}