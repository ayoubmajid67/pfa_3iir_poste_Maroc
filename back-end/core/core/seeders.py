from product.factories import ProductFactory
from send_request.factories import SMSFactory
from send_request.models import SMS
from custom_user.factories import UserFactory
from office.factories import OfficeFactory

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