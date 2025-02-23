<script>
  import NavLink from './NavLink.svelte';
  import AccordionNavLink from './AccordionNavLink.svelte';
  import { 
    LayoutDashboard, 
    ShoppingCart, 
    FileText, 
    Users, 
    DollarSign,
    Calculator,
    Truck,
    Building,
    FileCheck,
    Warehouse,
    Receipt,
    PiggyBank,
    Package,
    BadgeDollarSign,
    Database
  } from 'lucide-svelte';

  export let userEmail = '';
  export let userRole = '';

  const isAdmin = userRole === 'admin' || userEmail === 'admin@ljss.com';
  const isManager = userRole === 'manager' || userEmail === 'manager@ljss.com';
  const isCS = userRole === 'cs' || userEmail === 'cs@ljss.com';

  const navigationItems = [
    {
      type: 'single',
      href: '/dashboard',
      icon: LayoutDashboard,
      text: 'Dashboard',
      visible: true
    },
    {
      type: 'single',
      href: '/orders',
      icon: ShoppingCart,
      text: 'Order',
      visible: true
    },
    {
      type: 'single',
      href: '/invoices',
      icon: FileText,
      text: 'Invoice',
      visible: isManager || isCS
    },
    {
      type: 'single',
      href: '/employees',
      icon: Users,
      text: 'Data Pegawai',
      visible: isManager
    },
    {
      type: 'single',
      href: '/expenses',
      icon: DollarSign,
      text: 'Pengeluaran',
      visible: isManager
    },
    {
      type: 'accordion',
      text: 'Finance',
      icon: Calculator,
      visible: isManager || isAdmin,
      children: [
        {
          href: '/finance/order-calculation',
          icon: Calculator,
          text: 'Order Calculation',
          visible: true
        },
        {
          href: '/finance/direct-costs',
          icon: DollarSign,
          text: 'Biaya Langsung',
          visible: true
        },
        {
          href: '/finance/documents',
          icon: FileCheck,
          text: 'Data Dokumen',
          visible: true
        },
        {
          href: '/finance/other-costs',
          icon: BadgeDollarSign,
          text: 'Biaya Lain-lain',
          visible: true
        },
        {
          href: '/finance/payables',
          icon: Receipt,
          text: 'Hutang',
          visible: true
        },
        {
          href: '/finance/receivables',
          icon: PiggyBank,
          text: 'Piutang',
          visible: true
        },
        {
          href: '/finance/inventory',
          icon: Package,
          text: 'Inventaris',
          visible: true
        },
        {
          href: '/finance/tax',
          icon: BadgeDollarSign,
          text: 'Pajak',
          visible: true
        }
      ]
    },
    {
      type: 'accordion',
      text: 'Master Data',
      icon: Database,
      visible: true,
      children: [
        {
          href: '/master/party',
          icon: Users,
          text: 'Data Party',
          visible: true
        },
        {
          href: '/master/shipper',
          icon: Truck,
          text: 'Data Shipper',
          visible: true
        },
        {
          href: '/master/unloading',
          icon: Building,
          text: 'Data Bongkar',
          visible: true
        },
        {
          href: '/master/truck',
          icon: Truck,
          text: 'Data Truck',
          visible: true
        },
        {
          href: '/master/documents',
          icon: FileCheck,
          text: 'Data Dokumen',
          visible: true
        },
        {
          href: '/master/vendor',
          icon: Warehouse,
          text: 'Data Vendor',
          visible: true
        }
      ]
    }
  ];
</script>

<aside class="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 overflow-y-auto">
  <div class="p-4">
    <div class="flex items-center justify-center mb-8">
      <img src="/LOGO-LJSS.png" alt="LJSS Logo" class="h-8" />
    </div>

    <nav class="space-y-2">
      {#each navigationItems as item}
        {#if item.type === 'single'}
          <NavLink
            href={item.href}
            icon={item.icon}
            text={item.text}
            visible={item.visible}
          />
        {:else if item.type === 'accordion'}
          <AccordionNavLink
            text={item.text}
            icon={item.icon}
            visible={item.visible}
            children={item.children}
          />
        {/if}
      {/each}
    </nav>
  </div>
</aside>