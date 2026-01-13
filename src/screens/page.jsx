/* eslint-disable no-unused-vars */
import React from 'react';
import { Box, Button, Flex, FlexItem, Text } from '@/components';
import { Iconify, Input } from '@/components/ui';
import { useAuthUser, useDebounce, useGlobalSidebar, useHeader } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { Navigation, View } from '@/constants';
import { FaPlus } from 'react-icons/fa';
import {
  NfcCardOrderGridItem,
  NfcCardOrderGridItemSkeleton,
  NfcCardOrderListItem,
  NfcCardOrderListItemSkeleton,
} from '@/containers';
import { useGetNFCCardOrdersByUserId } from '@/queries';
import { useMediaQuery } from 'react-responsive';
import { cn } from '@/libs';
import { useInView } from 'react-intersection-observer';

const NfcCardsScreen = React.memo(() => {
  const [view, setView] = React.useState(View.Slider);
  const [search, setSearch] = React.useState('');
  const { setMobileNavMinimalHeader, setPrimaryHeader } = useHeader();
  const { isOpen: isSideBarOpen } = useGlobalSidebar();
  const navigate = useNavigate();

  const { id: userId } = useAuthUser();
  const {
    data: ordersByUserId,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetNFCCardOrdersByUserId(userId, 3);

  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const isSliderView = view === View.Slider;
  const _search = useDebounce(search)?.trim().toLowerCase();
  const { ref: loadMoreRef, inView } = useInView();

  const orders = React.useMemo(() => {
    return ordersByUserId?.pages?.flatMap((page) => page?.data?.orders) || [];
  }, [ordersByUserId]);

  const showInitialSkeleton = isFetching && orders.length === 0;

  const fallbackMessage = React.useMemo(
    () =>
      orders?.length
        ? 'No encontramos resultados en tu búsqueda'
        : 'No hay salidas de pedidos',
    [orders]
  );

  const filteredOrders = React.useMemo(() => {
    if (!_search) return orders || [];

    return (orders || []).filter((order) => {
      const mainMatch =
        order?.companyName?.toLowerCase().includes(_search) ||
        order?.configrationType?.toLowerCase().includes(_search) ||
        order?.status?.toLowerCase().includes(_search);

      const cardMatch = order?.cards?.some((c) =>
        [
          `${c?.name + ' ' + c?.lastName}`,
          c?.phone,
          c?.url?.url,
          c?.cardType,
          c?.card?.color,
          c?.card?.type,
          c?.card?.position,
        ].some((field) => field?.toLowerCase().includes(_search))
      );

      return mainMatch || cardMatch;
    });
  }, [orders, _search]);

  const onViewChange = React.useCallback(() => {
    setView((prev) => (prev === View.Slider ? View.Grid : View.Slider));
  }, []);

  const goToChooseCards = React.useCallback(() => {
    if (isDesktop) {
      navigate(Navigation.Dashboard.ChooseNfcCards);
    } else {
      navigate(Navigation.NfcCard.ChooseCards);
    }
  }, [isDesktop, navigate]);

  const onSearch = React.useCallback((e) => {
    const { value } = e.target;
    setSearch(value);
  }, []);

  React.useEffect(() => {
    setMobileNavMinimalHeader();

    return () => {
      setPrimaryHeader();
    };
  }, [setMobileNavMinimalHeader, setPrimaryHeader]);

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Flex direction="column" gap={4}>
      <FlexItem width="full" hide={{ base: false, lg: true }}>
        <Flex justify="between" align="center">
          <FlexItem>
            <Text
              font="sora"
              weight={{ base: 'extrabold' }}
              className="mt-0 text-2xl xl:text-[28px]"
            >
              Tarjeta NFC
            </Text>
          </FlexItem>

          <FlexItem>
            <Text
              size={{ base: 'sm' }}
              weight={{ base: 'medium' }}
              font="montserrat"
              color="primary"
              className="hover:underline cursor-pointer"
              onClick={onViewChange}
            >
              {isSliderView ? 'Ver todas' : 'Ver en lista'}
            </Text>
          </FlexItem>
        </Flex>
      </FlexItem>

      <FlexItem
        alignSelf="end"
        width={{ base: 'full', lg: 'fit' }}
        hide={{ base: false, lg: true }}
      >
        <Flex width="full" align="center" gap={2}>
          <FlexItem width="full">
            <Input
              placeholder="Buscar"
              startIconClass="!text-primary"
              className="sm:w-96 self-end"
              startIcon="mingcute:search-2-fill"
              innerInputClass="text-custom-neutral-200"
              inputClass="rounded-full border-custom-neutral-300 py-2.5"
              value={search}
              onChange={onSearch}
            />
          </FlexItem>
          <FlexItem hide={{ base: false, lg: true }}>
            <Button
              size={{ base: 'md', '2xl': 'lg' }}
              radius="full"
              className="w-10 !p-0"
              onClick={goToChooseCards}
            >
              <FaPlus size={14} />
            </Button>
          </FlexItem>
        </Flex>
      </FlexItem>

      <FlexItem hide={{ base: true, lg: false }} width="full">
        <Flex width="full" justify="between" align="center" gap={4}>
          <FlexItem
            className={cn(
              'w-full',
              isSideBarOpen
                ? isSliderView
                  ? 'lg:w-64 min-1200:w-72 xl:w-64 2xl:w-[277px] xl-custom:w-80'
                  : 'lg:w-[235px] min-1200:w-[275px] xl:!w-[260px] 2xl:!w-[280px] xl-custom:!w-80'
                : isSliderView
                  ? 'lg:w-72 2xl:w-80 xl-custom:w-[350px]'
                  : 'lg:w-[340px] xl:w-[285px] 2xl:w-[325px] xl-custom:w-[335px]'
            )}
          >
            <Box
              width="full"
              padding={{ x: 14, y: 4 }}
              onClick={goToChooseCards}
              radius={{ base: 'xl' }}
              className="border border-dashed border-primary bg-white hover:bg-white/80 cursor-pointer"
            >
              <Flex width="full" justify="center" align="center" gap={1}>
                <FlexItem>
                  <Iconify
                    className="text-primary size-4"
                    iconName="typcn:plus"
                  />
                </FlexItem>
                <FlexItem>
                  <Text
                    size="xs"
                    font="inter"
                    weight="semibold"
                    className="text-primary"
                  >
                    Nueva Tarjeta
                  </Text>
                </FlexItem>
              </Flex>
            </Box>
          </FlexItem>
          <FlexItem hide={{ base: true, lg: false }}>
            <Flex align="center" gap={4}>
              <FlexItem hide={{ base: true, lg: false }}>
                <Text
                  size={{ base: 'sm' }}
                  weight={{ base: 'medium' }}
                  font="montserrat"
                  color="primary"
                  className="hover:underline cursor-pointer"
                  onClick={onViewChange}
                >
                  {isSliderView ? 'Ver todas' : 'Ver en lista'}
                </Text>
              </FlexItem>
              <FlexItem>
                <Input
                  placeholder="Buscar"
                  startIconClass="!text-primary"
                  className="sm:w-96 self-end"
                  startIcon="mingcute:search-2-fill"
                  innerInputClass="text-custom-neutral-200"
                  inputClass="rounded-full border-custom-neutral-300 py-2.5"
                  value={search}
                  onChange={onSearch}
                />
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      </FlexItem>

      <FlexItem>
        {!showInitialSkeleton ? (
          filteredOrders?.length ? (
            <Box padding={{ y: 4 }}>
              {isSliderView ? (
                // List View
                <Flex direction="column" gap={{ base: 12, md: 12 }}>
                  {filteredOrders
                    ?.filter((order) => order?.cards?.length > 0)
                    ?.map((order) => (
                      <NfcCardOrderListItem card={order} key={order?.id} />
                    ))}
                </Flex>
              ) : (
                // Grid View
                <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-3">
                  {filteredOrders
                    ?.filter((order) => order?.cards?.length > 0)
                    ?.map((order) => (
                      <NfcCardOrderGridItem card={order} key={order?.id} />
                    ))}
                </Box>
              )}
            </Box>
          ) : (
            // For search
            <Box padding={{ y: 4 }}>
              {isSliderView ? (
                <NfcCardOrderListItemSkeleton fallback={fallbackMessage} />
              ) : (
                <NfcCardOrderGridItemSkeleton fallback={fallbackMessage} />
              )}
            </Box>
          )
        ) : (
          // For laoding state
          <Box padding={{ y: 4 }}>
            {isSliderView ? (
              <NfcCardOrderListItemSkeleton />
            ) : (
              <NfcCardOrderGridItemSkeleton />
            )}
          </Box>
        )}
      </FlexItem>
      <Box ref={loadMoreRef} grow width="full">
        {isFetchingNextPage ? (
          isSliderView ? (
            <NfcCardOrderListItemSkeleton />
          ) : (
            <NfcCardOrderGridItemSkeleton />
          )
        ) : hasNextPage ? (
          <Button
            size="md"
            variant="ghost"
            className="w-fit mx-auto"
            onClick={() => fetchNextPage()}
          >
            Load More
          </Button>
        ) : null}
      </Box>
    </Flex>
  );
});

export default NfcCardsScreen;






import { useInfiniteQuery } from '@tanstack/react-query';
import { axios } from '@/libs';
import { QueryKey } from '@/constants';

export const useGetNFCCardOrdersByUserId = (id, limit = 3) => {
  const queryKey  = [
    QueryKey.GetNFCCardsByUserId,
    id,
    'orders',
    'infinite',
    limit,
  ];

  const queryFn = async ({ pageParam = 1 }) => {
    const URL = `/nfcorder/all-order?userId=${id}&page=${pageParam}&limit=${limit}`;
    const { data } = await axios.get(URL);
    return data;
  };

  return useInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const page = Number(lastPage?.data?.page ?? lastPage?.page ?? 1);
      const totalPages = Number(
        lastPage?.data?.totalPages ?? lastPage?.totalPages ?? 1
      );
      return page < totalPages ? page + 1 : undefined;
    },
    placeholderData: () => ({ pages: [], pageParams: [] }),
    enabled: !!id,
  });
};