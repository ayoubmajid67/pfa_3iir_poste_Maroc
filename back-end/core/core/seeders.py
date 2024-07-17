from product.factories import ProductFactory
from send_request.factories import SMSFactory
from send_request.models import SMS
from custom_user.factories import UserFactory
from office.factories import OfficeFactory
from weight_range.models import Weight_range
from product.models import Product

# package product record (colis)
ProductFactory.create(
    code='CL',
    name='Colis',
    prefix='LD',
    sequence=0
)

# mail product record (courrier)
ProductFactory.create(
    code='CR',
    name='Courrier',
    prefix='RR',
    sequence=0
)

# SMS record
if not SMS.objects.exists(): # the record must not exist
    SMSFactory.create()

# admin user (just for testing)
UserFactory.create(
    email = 'admin@mail.com',
    password = 'admin',
    first_name = 'Admin',
    last_name = 'Admin',
    cin = '12345678',
    role = 'admin',
    status = 'actif',
    office = OfficeFactory(name='Admin Office', address='Admin Address', city='Admin City')
)

# weight ranges (for testing)
range_price = 10
range_length = 500  # each range is 500g
min_weight = 0
for _ in range(0, 10000, range_length):
    Weight_range.objects.create(
        min_weight=min_weight +1,
        max_weight=min_weight + range_length,
        price=range_price,
        product_id=Product.objects.get(code='CL').id
    )
    min_weight += range_length
    range_price += 10
