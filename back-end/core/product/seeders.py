from .factories import ProductFactory

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

