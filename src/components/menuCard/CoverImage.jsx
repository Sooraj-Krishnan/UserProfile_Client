import PropTypes from "prop-types";
import coverImage from "../../assets/images/loginbg.webp";
import logoImage from "../../assets/images/ZEEQR_White.svg";
import "./CoverImage.css";
function CoverImage({ cover, logo, fileList1, fileList2 }) {
  return (
    <div className="mobile">
      <img
        className="cover-image"
        src={
          fileList1 && fileList1[0]
            ? fileList1[0]?.originFileObj?.type
              ? URL.createObjectURL(fileList1[0]?.originFileObj)
              : fileList1[0]?.thumbUrl
            : cover || coverImage
        }
        alt="coverImage"
      />
      <img
        className="logo-image"
        src={
          fileList2 && fileList2[0]
            ? fileList2[0]?.originFileObj?.type
              ? URL.createObjectURL(fileList2[0]?.originFileObj)
              : fileList2[0]?.thumbUrl
            : logo || logoImage
        }
        alt="logoImage"
      />
    </div>
  );
}
CoverImage.propTypes = {
  cover: PropTypes.string,
  logo: PropTypes.string,
  fileList1: PropTypes.arrayOf(
    PropTypes.shape({
      originFileObj: PropTypes.object,
      thumbUrl: PropTypes.string,
    })
  ),
  fileList2: PropTypes.arrayOf(
    PropTypes.shape({
      originFileObj: PropTypes.object,
      thumbUrl: PropTypes.string,
    })
  ),
};
export default CoverImage;
