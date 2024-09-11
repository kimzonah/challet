const ChallengeForm = () => {
  return (
    <div>
      <h1>Challenge Form</h1>
      <div className='flex flex-col w-[336px] items-start gap-2.5 px-[11px] py-[22px] relative bg-white rounded-[15px] overflow-hidden'>
        <div className='relative w-[237px] h-14'>
          <div className='absolute w-[50px] h-[50px] top-[3px] left-0 bg-[#7f797980] rounded-[7px] overflow-hidden'>
            <img
              className='absolute w-10 h-10 top-[5px] left-[5px] object-cover'
              alt='Element'
              src='3dicons.png'
            />
          </div>
          <div className='flex flex-col w-[175px] items-start gap-1 absolute top-0 left-[62px]'>
            <div className="relative self-stretch mt-[-1.00px] [font-family:'Noto_Sans_KR-Medium',Helvetica] font-medium text-[#373a3f] text-[15px] tracking-[0] leading-4">
              커피 대신 물 마시자
            </div>
            <div className='relative w-[104px] h-4'>
              <div className="absolute w-[30px] top-0 left-0 [font-family:'Noto_Sans_KR-Regular',Helvetica] font-normal text-[#9095a1] text-[10px] tracking-[0] leading-4">
                5/6명
              </div>
              <div className="absolute top-0 left-[60px] [font-family:'Noto_Sans_KR-Regular',Helvetica] font-normal text-[#00b8b8] text-[10px] whitespace-nowrap tracking-[0] leading-4">
                50,000원
              </div>
            </div>
            <div className='relative w-[131px] h-4'>
              <p className="absolute w-28 top-0 left-[17px] [font-family:'Noto_Sans_KR-Medium',Helvetica] font-medium text-[#6c6c6c] text-[10px] tracking-[0] leading-4">
                3일뒤 시작 / 14일 동안
              </p>
              <div className='absolute w-[15px] h-[15px] top-px left-0'>
                <img
                  className='absolute w-[11px] h-[11px] top-0.5 left-0.5'
                  alt='Subtract'
                  src='subtract.svg'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeForm;
