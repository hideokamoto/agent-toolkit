import {
  createCustomer,
  listCustomers,
  createProduct,
  listProducts,
  createPrice,
  listPrices,
  createPaymentLink,
  createInvoice,
  createInvoiceItem,
  finalizeInvoice,
  retrieveBalance,
  createRefund,
  cancelSubscription,
} from '../../shared/functions';

const Stripe = jest.fn().mockImplementation(() => ({
  customers: {
    create: jest.fn(),
    list: jest.fn(),
  },
  products: {
    create: jest.fn(),
    list: jest.fn(),
  },
  prices: {
    create: jest.fn(),
    list: jest.fn(),
  },
  paymentLinks: {
    create: jest.fn(),
  },
  invoices: {
    create: jest.fn(),
    finalizeInvoice: jest.fn(),
    retrieve: jest.fn(),
  },
  invoiceItems: {
    create: jest.fn(),
  },
  balance: {
    retrieve: jest.fn(),
  },
  refunds: {
    create: jest.fn(),
  },
  subscriptions: {
    cancel: jest.fn(),
  },
}));

let stripe: ReturnType<typeof Stripe>;

beforeEach(() => {
  stripe = new Stripe('fake-api-key');
});

describe('createCustomer', () => {
  it('should create a customer and return the id', async () => {
    const params = {
      email: 'test@example.com',
      name: 'Test User',
    };

    const context = {};

    const mockCustomer = {id: 'cus_123456', email: 'test@example.com'};
    stripe.customers.create.mockResolvedValue(mockCustomer);

    const result = await createCustomer(stripe, context, params);

    expect(stripe.customers.create).toHaveBeenCalledWith(params, undefined);
    expect(result).toEqual({id: mockCustomer.id});
  });

  it('should specify the connected account if included in context', async () => {
    const params = {
      email: 'test@example.com',
      name: 'Test User',
    };

    const context = {
      account: 'acct_123456',
    };

    const mockCustomer = {id: 'cus_123456', email: 'test@example.com'};
    stripe.customers.create.mockResolvedValue(mockCustomer);

    const result = await createCustomer(stripe, context, params);

    expect(stripe.customers.create).toHaveBeenCalledWith(params, {
      stripeAccount: context.account,
    });
    expect(result).toEqual({id: mockCustomer.id});
  });
});

describe('listCustomers', () => {
  it('should list customers and return their ids', async () => {
    const mockCustomers = [
      {id: 'cus_123456', email: 'test1@example.com'},
      {id: 'cus_789012', email: 'test2@example.com'},
    ];

    const context = {};

    stripe.customers.list.mockResolvedValue({data: mockCustomers});
    const result = await listCustomers(stripe, context, {});

    expect(stripe.customers.list).toHaveBeenCalledWith({}, undefined);
    expect(result).toEqual(mockCustomers.map(({id}) => ({id})));
  });

  it('should specify the connected account if included in context', async () => {
    const mockCustomers = [
      {id: 'cus_123456', email: 'test1@example.com'},
      {id: 'cus_789012', email: 'test2@example.com'},
    ];

    const context = {
      account: 'acct_123456',
    };

    stripe.customers.list.mockResolvedValue({data: mockCustomers});
    const result = await listCustomers(stripe, context, {});

    expect(stripe.customers.list).toHaveBeenCalledWith(
      {},
      {
        stripeAccount: context.account,
      }
    );
    expect(result).toEqual(mockCustomers.map(({id}) => ({id})));
  });
});

describe('createProduct', () => {
  it('should create a product and return it', async () => {
    const params = {
      name: 'Test Product',
    };

    const context = {};

    const mockProduct = {id: 'prod_123456', name: 'Test Product'};
    stripe.products.create.mockResolvedValue(mockProduct);

    const result = await createProduct(stripe, context, params);

    expect(stripe.products.create).toHaveBeenCalledWith(params, undefined);
    expect(result).toEqual(mockProduct);
  });

  it('should specify the connected account if included in context', async () => {
    const params = {
      name: 'Test Product',
    };

    const context = {
      account: 'acct_123456',
    };

    const mockProduct = {id: 'prod_123456', name: 'Test Product'};
    stripe.products.create.mockResolvedValue(mockProduct);

    const result = await createProduct(stripe, context, params);

    expect(stripe.products.create).toHaveBeenCalledWith(params, {
      stripeAccount: context.account,
    });
    expect(result).toEqual(mockProduct);
  });
});

describe('listProducts', () => {
  it('should list products and return them', async () => {
    const mockProducts = [
      {id: 'prod_123456', name: 'Test Product 1'},
      {id: 'prod_789012', name: 'Test Product 2'},
    ];

    const context = {};

    stripe.products.list.mockResolvedValue({data: mockProducts});
    const result = await listProducts(stripe, context, {});

    expect(stripe.products.list).toHaveBeenCalledWith({}, undefined);
    expect(result).toEqual(mockProducts);
  });

  it('should specify the connected account if included in context', async () => {
    const mockProducts = [
      {id: 'prod_123456', name: 'Test Product 1'},
      {id: 'prod_789012', name: 'Test Product 2'},
    ];

    const context = {
      account: 'acct_123456',
    };

    stripe.products.list.mockResolvedValue({data: mockProducts});
    const result = await listProducts(stripe, context, {});

    expect(stripe.products.list).toHaveBeenCalledWith(
      {},
      {
        stripeAccount: context.account,
      }
    );
    expect(result).toEqual(mockProducts);
  });
});

describe('createPrice', () => {
  it('should create a price and return it', async () => {
    const params = {
      unit_amount: 1000,
      currency: 'usd',
      product: 'prod_123456',
    };

    const context = {};

    const mockPrice = {id: 'price_123456', unit_amount: 1000, currency: 'usd'};
    stripe.prices.create.mockResolvedValue(mockPrice);

    const result = await createPrice(stripe, context, params);

    expect(stripe.prices.create).toHaveBeenCalledWith(params, undefined);
    expect(result).toEqual(mockPrice);
  });

  it('should specify the connected account if included in context', async () => {
    const params = {
      unit_amount: 1000,
      currency: 'usd',
      product: 'prod_123456',
    };

    const context = {
      account: 'acct_123456',
    };

    const mockPrice = {id: 'price_123456', unit_amount: 1000, currency: 'usd'};
    stripe.prices.create.mockResolvedValue(mockPrice);

    const result = await createPrice(stripe, context, params);

    expect(stripe.prices.create).toHaveBeenCalledWith(params, {
      stripeAccount: context.account,
    });
    expect(result).toEqual(mockPrice);
  });
});

describe('listPrices', () => {
  it('should list prices and return them', async () => {
    const mockPrices = [
      {id: 'price_123456', unit_amount: 1000, currency: 'usd'},
      {id: 'price_789012', unit_amount: 2000, currency: 'usd'},
    ];

    const context = {};

    stripe.prices.list.mockResolvedValue({data: mockPrices});
    const result = await listPrices(stripe, context, {});

    expect(stripe.prices.list).toHaveBeenCalledWith({}, undefined);
    expect(result).toEqual(mockPrices);
  });

  it('should specify the connected account if included in context', async () => {
    const mockPrices = [
      {id: 'price_123456', unit_amount: 1000, currency: 'usd'},
      {id: 'price_789012', unit_amount: 2000, currency: 'usd'},
    ];

    const context = {
      account: 'acct_123456',
    };

    stripe.prices.list.mockResolvedValue({data: mockPrices});
    const result = await listPrices(stripe, context, {});

    expect(stripe.prices.list).toHaveBeenCalledWith(
      {},
      {
        stripeAccount: context.account,
      }
    );
    expect(result).toEqual(mockPrices);
  });
});

describe('createPaymentLink', () => {
  it('should create a payment link and return it', async () => {
    const params = {
      line_items: [
        {
          price: 'price_123456',
          quantity: 1,
        },
      ],
    };

    const mockPaymentLink = {
      id: 'pl_123456',
      url: 'https://example.com',
    };

    const context = {};

    stripe.paymentLinks.create.mockResolvedValue(mockPaymentLink);

    const result = await createPaymentLink(stripe, context, {
      price: 'price_123456',
      quantity: 1,
    });

    expect(stripe.paymentLinks.create).toHaveBeenCalledWith(params, undefined);
    expect(result).toEqual(mockPaymentLink);
  });

  it('should specify the connected account if included in context', async () => {
    const params = {
      line_items: [
        {
          price: 'price_123456',
          quantity: 1,
        },
      ],
    };

    const mockPaymentLink = {
      id: 'pl_123456',
      url: 'https://example.com',
    };

    const context = {
      account: 'acct_123456',
    };

    stripe.paymentLinks.create.mockResolvedValue(mockPaymentLink);

    const result = await createPaymentLink(stripe, context, {
      price: 'price_123456',
      quantity: 1,
    });

    expect(stripe.paymentLinks.create).toHaveBeenCalledWith(params, {
      stripeAccount: context.account,
    });
    expect(result).toEqual(mockPaymentLink);
  });
});

describe('createInvoice', () => {
  it('should create an invoice and return it', async () => {
    const params = {
      customer: 'cus_123456',
      items: [{price: 'price_123456', quantity: 1}],
    };

    const mockInvoice = {id: 'in_123456', customer: 'cus_123456'};

    const context = {};

    stripe.invoices.create.mockResolvedValue(mockInvoice);

    const result = await createInvoice(stripe, context, params);

    expect(stripe.invoices.create).toHaveBeenCalledWith(params, undefined);
    expect(result).toEqual(mockInvoice);
  });

  it('should specify the connected account if included in context', async () => {
    const params = {
      customer: 'cus_123456',
      items: [{price: 'price_123456', quantity: 1}],
    };

    const mockInvoice = {id: 'in_123456', customer: 'cus_123456'};

    const context = {
      account: 'acct_123456',
    };

    stripe.invoices.create.mockResolvedValue(mockInvoice);

    const result = await createInvoice(stripe, context, params);

    expect(stripe.invoices.create).toHaveBeenCalledWith(params, {
      stripeAccount: context.account,
    });
    expect(result).toEqual(mockInvoice);
  });
});

describe('finalizeInvoice', () => {
  it('should finalize an invoice and return it', async () => {
    const invoiceId = 'in_123456';

    const mockInvoice = {id: invoiceId, customer: 'cus_123456'};

    const context = {};

    stripe.invoices.finalizeInvoice.mockResolvedValue(mockInvoice);

    const result = await finalizeInvoice(stripe, context, {invoice: invoiceId});

    expect(stripe.invoices.finalizeInvoice).toHaveBeenCalledWith(
      invoiceId,
      undefined
    );
    expect(result).toEqual(mockInvoice);
  });

  it('should specify the connected account if included in context', async () => {
    const invoiceId = 'in_123456';

    const mockInvoice = {id: invoiceId, customer: 'cus_123456'};

    const context = {
      account: 'acct_123456',
    };

    stripe.invoices.finalizeInvoice.mockResolvedValue(mockInvoice);

    const result = await finalizeInvoice(stripe, context, {invoice: invoiceId});

    expect(stripe.invoices.finalizeInvoice).toHaveBeenCalledWith(invoiceId, {
      stripeAccount: context.account,
    });
    expect(result).toEqual(mockInvoice);
  });
});

describe('createInvoiceItem', () => {
  it('should create an invoice item and return it', async () => {
    const params = {
      customer: 'cus_123456',
      price: 'price_123456',
      invoice: 'in_123456',
    };

    const mockInvoiceItem = {id: 'ii_123456', invoice: 'in_123456'};

    const context = {};

    stripe.invoiceItems.create.mockResolvedValue(mockInvoiceItem);

    const result = await createInvoiceItem(stripe, context, params);

    expect(stripe.invoiceItems.create).toHaveBeenCalledWith(params, undefined);
    expect(result).toEqual(mockInvoiceItem);
  });

  it('should specify the connected account if included in context', async () => {
    const params = {
      customer: 'cus_123456',
      price: 'price_123456',
      invoice: 'in_123456',
    };

    const mockInvoiceItem = {id: 'ii_123456', invoice: 'in_123456'};

    const context = {
      account: 'acct_123456',
    };

    stripe.invoiceItems.create.mockResolvedValue(mockInvoiceItem);

    const result = await createInvoiceItem(stripe, context, params);

    expect(stripe.invoiceItems.create).toHaveBeenCalledWith(params, {
      stripeAccount: context.account,
    });
    expect(result).toEqual(mockInvoiceItem);
  });
});

describe('retrieveBalance', () => {
  it('should retrieve the balance and return it', async () => {
    const mockBalance = {available: [{amount: 1000, currency: 'usd'}]};

    const context = {};

    stripe.balance.retrieve.mockResolvedValue(mockBalance);

    const result = await retrieveBalance(stripe, context, {});

    expect(stripe.balance.retrieve).toHaveBeenCalledWith({}, undefined);
    expect(result).toEqual(mockBalance);
  });

  it('should specify the connected account if included in context', async () => {
    const mockBalance = {available: [{amount: 1000, currency: 'usd'}]};

    const context = {
      account: 'acct_123456',
    };

    stripe.balance.retrieve.mockResolvedValue(mockBalance);

    const result = await retrieveBalance(stripe, context, {});

    expect(stripe.balance.retrieve).toHaveBeenCalledWith(
      {},
      {
        stripeAccount: context.account,
      }
    );
    expect(result).toEqual(mockBalance);
  });
});

describe('createRefund', () => {
  it('should create a refund and return it', async () => {
    const params = {
      payment_intent: 'pi_123456',
    };

    const mockRefund = {id: 're_123456'};

    const context = {};

    stripe.refunds.create.mockResolvedValue(mockRefund);

    const result = await createRefund(stripe, context, params);

    expect(stripe.refunds.create).toHaveBeenCalledWith(params, undefined);
    expect(result).toEqual(mockRefund);
  });

  it('should create a partial refund and return it', async () => {
    const params = {
      payment_intent: 'pi_123456',
      amount: 500,
    };

    const mockRefund = {id: 're_123456'};

    const context = {};

    stripe.refunds.create.mockResolvedValue(mockRefund);

    const result = await createRefund(stripe, context, params);

    expect(stripe.refunds.create).toHaveBeenCalledWith(params, undefined);
    expect(result).toEqual(mockRefund);
  });

  it('should specify the connected account if included in context', async () => {
    const params = {
      payment_intent: 'pi_123456',
    };

    const mockRefund = {id: 're_123456'};

    const context = {
      account: 'acct_123456',
    };

    stripe.refunds.create.mockResolvedValue(mockRefund);

    const result = await createRefund(stripe, context, params);

    expect(stripe.refunds.create).toHaveBeenCalledWith(params, {
      stripeAccount: context.account,
    });
    expect(result).toEqual(mockRefund);
  });
});

describe('cancelSubscription', () => {
  it('should cancel a subscription and return it', async () => {
    const params = {
      subscription: 'sub_123456',
    };

    const mockSubscription = {id: 'sub_123456'};

    const context = {};

    stripe.subscriptions.cancel.mockResolvedValue(mockSubscription);

    const result = await cancelSubscription(stripe, context, params);

    expect(stripe.subscriptions.cancel).toHaveBeenCalledWith(
      params.subscription,
      undefined
    );

    expect(result).toEqual(mockSubscription);
  });

  it('should specify the connected account if included in context', async () => {
    const params = {
      subscription: 'sub_123456',
    };

    const mockSubscription = {id: 'sub_123456'};

    const context = {
      account: 'acct_123456',
    };

    stripe.subscriptions.cancel.mockResolvedValue(mockSubscription);

    const result = await cancelSubscription(stripe, context, params);

    expect(stripe.subscriptions.cancel).toHaveBeenCalledWith(
      params.subscription,
      {
        stripeAccount: context.account,
      }
    );

    expect(result).toEqual(mockSubscription);
  });
});
