import { loadStripe } from "@stripe/stripe-js";
//const stripeR = require('stripe')('pk_live_51LiNRjJFdabvAAao6KPgNfPXHo2wZ1WWckYixjNgH1eJojYrrA6MTBkmrMTBgLCT1YDuV1byzrjyMAlFrroMA3QT00O8FSEb9c');
var stripePromise = loadStripe("pk_live_51LiNRjJFdabvAAao6KPgNfPXHo2wZ1WWckYixjNgH1eJojYrrA6MTBkmrMTBgLCT1YDuV1byzrjyMAlFrroMA3QT00O8FSEb9c")

export async function checkout(data) {
    const getStripe = () => {
        if (!stripePromise) {
            stripePromise = loadStripe("pk_live_51LiNRjJFdabvAAao6KPgNfPXHo2wZ1WWckYixjNgH1eJojYrrA6MTBkmrMTBgLCT1YDuV1byzrjyMAlFrroMA3QT00O8FSEb9c")//(process.env.STRIPE_API_KEY)
        }
        return stripePromise
    }
    await stripePromise.redirectToCheckout({
        mode: "subscription",
        lineItems: data.lineItems,
        successUrl: `${window.location.origin}/checkouts/${data.code}`, // {CHECKOUT_SESSION_ID}
        cancelUrl: window.location.origin
    })
}