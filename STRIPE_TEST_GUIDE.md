# Stripe Payment Testing Guide

This guide provides comprehensive instructions for testing the Stripe payment integration in test mode.

## Test Environment Setup

The application is configured to use Stripe's test mode by default. All transactions use test credentials and will not result in actual charges.

## Test Card Numbers

### Successful Payments
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **Postal Code**: Any 5 digits

### Declined Payments
Use these card numbers to test different decline scenarios:

| Card Number | Decline Reason | Description |
|-------------|----------------|-------------|
| `4000 0000 0000 0002` | Generic Decline | Card is declined |
| `4000 0000 0000 9995` | Insufficient Funds | Not enough balance |
| `4000 0000 0000 9987` | Lost Card | Card reported as lost |
| `4000 0000 0000 9979` | Stolen Card | Card reported as stolen |

### 3D Secure Authentication
- **Card Number**: `4000 0025 0000 3155`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **Postal Code**: Any 5 digits

### Other Test Scenarios
- **CVC Check Failure**: `4000 0000 0000 0127`
- **Address Check Failure**: `4000 0000 0000 0127`
- **Zip Check Failure**: `4000 0000 0000 0127`

## Testing Workflow

### 1. Product Selection
1. Navigate to the homepage
2. Browse products using the enhanced product grid
3. Use filters and search if needed
4. Click "Quick Add" for single-size products or "View Options" for multi-size products

### 2. Cart Management
1. Click the cart icon to open the slide-out cart
2. Adjust quantities using the +/- buttons
3. Apply test coupon codes:
   - `TEST10` for 10% discount
   - `TEST20` for 20% discount
4. Click "Proceed to Checkout"

### 3. Checkout Process
1. **Contact Information**: Fill in name, email, and phone
2. **Shipping Address**: Complete the address form
3. **Payment Method**: Use the test card selector in test mode
4. **Review**: Check order summary before payment

### 4. Payment Testing
1. Select a test card from the dropdown in test mode
2. Fill in card details (or use the pre-filled test card)
3. Click "Pay" to process the payment
4. Observe the payment processing flow

## Expected Behaviors

### Successful Payment
- Payment processes immediately
- Redirects to success page
- Order confirmation displayed
- Webhook events triggered
- Cart cleared

### Declined Payment
- Error message displayed
- User can retry with different card
- Cart items preserved
- Helpful error messaging

### 3D Secure Flow
- Additional authentication step
- Modal window for verification
- Complete authentication to proceed

## Webhook Testing

The application handles these webhook events:
- `payment_intent.succeeded` - Payment completed successfully
- `payment_intent.payment_failed` - Payment declined
- `payment_intent.requires_action` - 3D Secure required
- `checkout.session.completed` - Legacy checkout flow
- `checkout.session.expired` - Checkout session expired

### Testing Webhooks Locally
Use the Stripe CLI to test webhooks locally:
```bash
stripe listen --forward-to localhost:8000/api/stripe/webhook
```

## Test Coupon Codes

| Code | Discount | Description |
|------|----------|-------------|
| `TEST10` | 10% | Test 10% discount |
| `TEST20` | 20% | Test 20% discount |

## Error Handling Tests

### Network Errors
- Test with slow network connection
- Test with network interruption
- Verify retry mechanisms

### Form Validation
- Test with invalid email formats
- Test with incomplete forms
- Test with invalid phone numbers

### Payment Errors
- Test with expired cards
- Test with insufficient funds
- Test with CVC mismatches

## Mobile Testing

Test the payment flow on:
- Mobile browsers (Chrome, Safari)
- Tablet devices
- Different screen sizes
- Touch interactions

## Performance Testing

Monitor:
- Page load times
- Payment processing speed
- Webhook response times
- Error recovery times

## Security Testing

Verify:
- HTTPS enforcement
- PCI compliance
- Data encryption
- Secure token handling

## Troubleshooting

### Common Issues

1. **Payment not processing**
   - Check Stripe keys in environment variables
   - Verify webhook endpoint is accessible
   - Check browser console for errors

2. **Webhook not firing**
   - Ensure webhook secret is configured
   - Check Stripe CLI forwarding
   - Verify webhook URL is correct

3. **Test cards not working**
   - Ensure test mode is enabled
   - Use correct test card numbers
   - Check expiry dates are in the future

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=stripe:*
```

## Production Deployment

Before going live:
1. Switch to live Stripe keys
2. Update webhook endpoints
3. Test with real cards (small amounts)
4. Monitor error rates
5. Set up alerts for failures

## Support

For issues with:
- **Stripe Integration**: Check Stripe documentation
- **Test Cards**: Use Stripe's test card guide
- **Webhooks**: Verify Stripe CLI setup
- **Application**: Check application logs

## Additional Resources

- [Stripe Testing Documentation](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe React Elements](https://stripe.com/docs/stripe-js/react)
- [Payment Intents API](https://stripe.com/docs/api/payment_intents)