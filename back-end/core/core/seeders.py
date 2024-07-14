from product.factories import ProductFactory
from send_request.factories import SMSFactory
from send_request.models import SMS

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